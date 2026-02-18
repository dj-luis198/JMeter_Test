/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 67.99336650082918, "KoPercent": 32.00663349917081};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5141277641277642, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9142e121-7157-47e0-a8a1-c316af1ead27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef6eda3c-8d6a-4a4e-abe7-bbc086c7092c"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=940cb24b-7451-4f25-b773-3e13af44839a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=147bae0a-caf7-47aa-91e7-1e42ce637b6b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b758ef9-e579-475a-b89a-9c832903dca2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4de952dd-e834-47b0-b463-50c5a264d760"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b421cc2-be99-447d-b74c-73c119adfc7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4911456d-0042-4f4a-87c7-4f806e29cdec"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef6eda3c-8d6a-4a4e-abe7-bbc086c7092c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/256c7b64-3fdd-4671-b8f8-ee1544b7f753"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9142e121-7157-47e0-a8a1-c316af1ead27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/940cb24b-7451-4f25-b773-3e13af44839a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/703708e3-7c4c-45b3-bea2-6232aa6649a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=703708e3-7c4c-45b3-bea2-6232aa6649a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d70d1b07-e19a-48a7-bde2-039bea32d7f8"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd126141-fc44-42c7-939a-9bccb00cf999"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a4d5981-b6ce-461f-8f27-5ab3698e0744"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4de952dd-e834-47b0-b463-50c5a264d760"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a4d5981-b6ce-461f-8f27-5ab3698e0744"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b96250b5-09ee-4550-9fdd-c6a03ed87f28"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b96250b5-09ee-4550-9fdd-c6a03ed87f28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=304f12a2-58a2-493d-b6ba-e96bbf923f2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44419b8a-a4e1-4dd7-87d9-973065f94405"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3e5b9649-68f1-4285-9570-0297d704bb95"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/304f12a2-58a2-493d-b6ba-e96bbf923f2c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44419b8a-a4e1-4dd7-87d9-973065f94405"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6829313c-d7cd-4681-bbc6-5c650bead66e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/147bae0a-caf7-47aa-91e7-1e42ce637b6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b758ef9-e579-475a-b89a-9c832903dca2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6829313c-d7cd-4681-bbc6-5c650bead66e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 603, 193, 32.00663349917081, 297.35157545605256, 117, 2184, 137.0, 656.4000000000002, 989.9999999999991, 1593.9200000000028, 2.4096385542168677, 2.5096030889728067, 1.151270192711143], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9142e121-7157-47e0-a8a1-c316af1ead27", 3, 0, 0.0, 356.0, 225, 445, 398.0, 445.0, 445.0, 445.0, 0.021161483278901296, 0.025012156831279494, 0.013570352232889177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef6eda3c-8d6a-4a4e-abe7-bbc086c7092c", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["see books", 57, 57, 100.0, 738.3333333333331, 493, 1371, 771.0, 971.8, 1129.1999999999987, 1371.0, 0.253477533885944, 1.6300853235396136, 0.42551550854486103], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 169.77777777777774, 125, 395, 135.5, 385.1, 395.0, 395.0, 0.09209657861210456, 0.07150076171545228, 0.03273745567852154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, 100.0, 166.6, 118, 397, 131.0, 394.0, 397.0, 397.0, 0.0830702774547267, 0.04129176877388271, 0.04169738536301711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=940cb24b-7451-4f25-b773-3e13af44839a", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=147bae0a-caf7-47aa-91e7-1e42ce637b6b", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 0.681751179245283, 2.6017099056603774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b758ef9-e579-475a-b89a-9c832903dca2", 3, 0, 0.0, 355.0, 226, 589, 250.0, 589.0, 589.0, 589.0, 0.042591856437049234, 0.02649512944375035, 0.027313137103185867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4de952dd-e834-47b0-b463-50c5a264d760", 3, 0, 0.0, 436.3333333333333, 265, 626, 418.0, 626.0, 626.0, 626.0, 0.03166761669516752, 0.02639998904828256, 0.020307683883294278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, 100.0, 146.99999999999997, 123, 379, 128.0, 235.00000000000023, 379.0, 379.0, 0.12383560135943972, 0.061555001066362115, 0.062159667088625005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b421cc2-be99-447d-b74c-73c119adfc7c", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.1126687717770036, 2.0790233013937285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4911456d-0042-4f4a-87c7-4f806e29cdec", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.6451231060606061, 1.2054135101010102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 2.0769146126760565, 4.353268045774648], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 250.9298245614036, 119, 681, 131.0, 520.4, 584.6999999999998, 681.0, 0.26187150837988826, 0.13016855250523743, 0.12658827797660616], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 598.3846153846154, 152, 1611, 467.0, 1282.9999999999998, 1611.0, 1611.0, 0.07474829947618691, 0.014161298924199475, 0.050530344575285914], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 598.3846153846154, 152, 1611, 467.0, 1282.9999999999998, 1611.0, 1611.0, 0.07667309541082035, 0.014525957529003073, 0.051831519351109696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1012.9545454545456, 378, 1928, 1014.5, 1370.1, 1849.399999999999, 1928.0, 0.09590987958950571, 0.030482720963283954, 0.043271840205421526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef6eda3c-8d6a-4a4e-abe7-bbc086c7092c", 3, 0, 0.0, 320.0, 225, 423, 312.0, 423.0, 423.0, 423.0, 0.07836990595611286, 0.03546034156217346, 0.05025674307732497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/256c7b64-3fdd-4671-b8f8-ee1544b7f753", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9142e121-7157-47e0-a8a1-c316af1ead27", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/940cb24b-7451-4f25-b773-3e13af44839a", 3, 0, 0.0, 292.6666666666667, 219, 415, 244.0, 415.0, 415.0, 415.0, 0.024089613361705543, 0.024160188400851167, 0.015448091901874975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/703708e3-7c4c-45b3-bea2-6232aa6649a8", 3, 0, 0.0, 418.3333333333333, 313, 537, 405.0, 537.0, 537.0, 537.0, 0.0346172486210796, 0.028858975819851838, 0.022199212169116796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=703708e3-7c4c-45b3-bea2-6232aa6649a8", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 170.0, 126, 390, 136.0, 390.0, 390.0, 390.0, 0.04195888029730864, 0.033026228046514415, 0.014915070730683929], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 499.16666666666674, 127, 745, 507.5, 723.1000000000001, 745.0, 745.0, 0.09110372158702683, 0.01886131735981415, 0.061366007777980236], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1231.6363636363637, 795, 2184, 1183.0, 1698.5, 2117.699999999999, 2184.0, 0.09787870159453303, 0.05065987484873292, 0.04502037934670416], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 248.6153846153846, 127, 445, 226.0, 392.19999999999993, 445.0, 445.0, 0.07480722752905973, 0.15158691125273335, 0.047872804335941994], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 234.14285714285714, 123, 528, 133.0, 528.0, 528.0, 528.0, 0.04455987574160365, 0.022149391359840093, 0.02236696887810964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d70d1b07-e19a-48a7-bde2-039bea32d7f8", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.9097889957264957, 1.6999421296296298], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 792.2542372881359, 503, 2370, 771.0, 974.0, 1058.0, 2370.0, 0.2874151151121893, 0.9161880093702199, 0.5619332761547755], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dd126141-fc44-42c7-939a-9bccb00cf999", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 139.05555555555557, 124, 213, 131.0, 173.40000000000006, 213.0, 213.0, 0.1264702162640698, 0.09448214398634122, 0.04495620968761857], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 422.15384615384613, 142, 754, 417.0, 739.6, 754.0, 754.0, 0.07681671531725304, 0.014553166769088953, 0.052540278918538824], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 8, 4.571428571428571, 216.66285714285704, 119, 1844, 138.0, 396.40000000000003, 501.3999999999996, 1046.0000000000095, 0.7535178519143659, 1.6248695808610771, 0.3617936913870757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 135.6153846153846, 125, 190, 131.0, 170.39999999999998, 190.0, 190.0, 0.08483812233657241, 0.06569983497353703, 0.030157301299328473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a4d5981-b6ce-461f-8f27-5ab3698e0744", 3, 0, 0.0, 301.3333333333333, 217, 426, 261.0, 426.0, 426.0, 426.0, 0.04242201419723409, 0.02727326759099522, 0.02720422134392941], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4de952dd-e834-47b0-b463-50c5a264d760", 1, 0, 0.0, 754.0, 754, 754, 754.0, 754.0, 754.0, 754.0, 1.3262599469496021, 0.2396075099469496, 0.9143940649867374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, 100.0, 162.3, 124, 464, 129.5, 431.0000000000001, 464.0, 464.0, 0.0520407791545455, 0.025867926357093417, 0.02612203172405897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 136.5263157894737, 123, 210, 131.0, 154.0, 210.0, 210.0, 0.08782918610080016, 0.07127544301734857, 0.03122053099676881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a4d5981-b6ce-461f-8f27-5ab3698e0744", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 537.3636363636363, 189, 1109, 538.5, 970.1, 1088.2999999999997, 1109.0, 0.0978504045224678, 0.06010537543421117, 0.04424290751357674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b96250b5-09ee-4550-9fdd-c6a03ed87f28", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["login", 22, 4, 18.181818181818183, 2077.318181818182, 1391, 3292, 1966.5, 3058.6, 3272.6499999999996, 3292.0, 0.09597222040456653, 0.14237356205258406, 0.14418837765504966], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 13, 100.0, 132.1538461538462, 123, 189, 127.0, 165.39999999999998, 189.0, 189.0, 0.08044006905470544, 0.03998437026254401, 0.04037714403722519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b96250b5-09ee-4550-9fdd-c6a03ed87f28", 3, 0, 0.0, 390.6666666666667, 276, 478, 418.0, 478.0, 478.0, 478.0, 0.018655440237297198, 0.025718030405258347, 0.011963286870923009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 169.06666666666666, 125, 396, 136.0, 390.6, 396.0, 396.0, 0.08153104430396947, 0.0660051130156159, 0.028981738404926648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, 100.0, 162.83333333333334, 117, 399, 130.0, 388.20000000000005, 399.0, 399.0, 0.08682732938429777, 0.04315928775059332, 0.043583249319852586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=304f12a2-58a2-493d-b6ba-e96bbf923f2c", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44419b8a-a4e1-4dd7-87d9-973065f94405", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e5b9649-68f1-4285-9570-0297d704bb95", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.5795570553539019, 1.0829032441016333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/304f12a2-58a2-493d-b6ba-e96bbf923f2c", 3, 0, 0.0, 440.33333333333337, 217, 745, 359.0, 745.0, 745.0, 745.0, 0.01931558445739304, 0.02662809250555323, 0.012386621543315199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44419b8a-a4e1-4dd7-87d9-973065f94405", 3, 0, 0.0, 369.33333333333337, 206, 672, 230.0, 672.0, 672.0, 672.0, 0.03671296579575353, 0.030606088998347915, 0.02354314538334455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6829313c-d7cd-4681-bbc6-5c650bead66e", 1, 0, 0.0, 718.0, 718, 718, 718.0, 718.0, 718.0, 718.0, 1.392757660167131, 0.2516212569637883, 0.9602411211699164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 185.4, 128, 384, 139.0, 381.5, 384.0, 384.0, 0.05380828109446044, 0.04461252993085636, 0.019127162420296485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 148.4375, 117, 428, 130.0, 244.6000000000002, 428.0, 428.0, 0.08069152638108591, 0.04010936223434836, 0.04050336382800601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/147bae0a-caf7-47aa-91e7-1e42ce637b6b", 2, 0, 0.0, 267.0, 207, 327, 267.0, 327.0, 327.0, 327.0, 0.06481511488479112, 0.038072550393751826, 0.04028791076579058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 140.125, 119, 197, 133.0, 185.10000000000002, 197.0, 197.0, 0.08083135043926787, 0.06275480820236128, 0.0287330191014585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b758ef9-e579-475a-b89a-9c832903dca2", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6829313c-d7cd-4681-bbc6-5c650bead66e", 3, 0, 0.0, 348.6666666666667, 227, 554, 265.0, 554.0, 554.0, 554.0, 0.028326739497861332, 0.028409727992483973, 0.018165259378511336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 19, 100.0, 181.05263157894734, 123, 715, 131.0, 414.0, 715.0, 715.0, 0.09188376220482342, 0.045672690392827266, 0.046121341575468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, 100.0, 209.5, 125, 391, 132.0, 391.0, 391.0, 391.0, 0.04783773440489859, 0.02377871758993494, 0.02713452220069524], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1012.9545454545456, 378, 1928, 1014.5, 1370.1, 1849.399999999999, 1928.0, 0.09625860311265319, 0.030593554611443398, 0.04342917445121658], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.0725388601036268, 0.6633499170812603], "isController": false}, {"data": ["401/Unauthorized", 10, 5.181347150259067, 1.658374792703151], "isController": false}, {"data": ["404/Not Found", 179, 92.74611398963731, 29.6849087893864], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 603, 193, "404/Not Found", 179, "401/Unauthorized", 10, "406/Not Acceptable", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
