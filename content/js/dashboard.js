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

    var data = {"OkPercent": 99.77168949771689, "KoPercent": 0.228310502283105};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7808988764044944, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6450c1f-a73e-4aca-94d5-d65607e53f6c"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4891e14b-178f-4c56-9c97-20dfd5fa6da7"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a96d6a80-b17b-4070-b3af-93c3d290f449"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/332cd883-cff2-4c2b-9922-f803fda9c5f9"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cd580c1-99d8-4d96-81ef-f27cef5d4abb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc196afb-8f01-4797-a0c2-7b6552dc1982"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b37c8f91-51d5-4331-8d4f-37ec15251bc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1dc7b89-e416-4266-9b51-dc84f1049e83"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4891e14b-178f-4c56-9c97-20dfd5fa6da7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=746b3cf2-ff61-4a77-901f-b618679c5e06"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c8cb963-78ce-49b4-af5a-8ec6756aacdf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8955714c-a945-49e5-a1f0-4210a5b027ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bb87cca-63b8-4f0d-a647-286daeb69779"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11e40f31-9b15-4ff9-b384-eb613c16ea3d"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.35, 500, 1500, "register"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1f7f56b0-c242-4cf6-951d-39f619b18cc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c92b9820-97b9-41a7-b1a8-7fe83d540ae4"], "isController": false}, {"data": [0.34375, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f44c010e-46c2-4bf4-b8c8-3e016e3a393f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c199e05-f274-424d-85f5-0c9baa9a49de"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9756756756756757, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bb87cca-63b8-4f0d-a647-286daeb69779"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f44c010e-46c2-4bf4-b8c8-3e016e3a393f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a96d6a80-b17b-4070-b3af-93c3d290f449"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc196afb-8f01-4797-a0c2-7b6552dc1982"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1dc7b89-e416-4266-9b51-dc84f1049e83"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8955714c-a945-49e5-a1f0-4210a5b027ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11e40f31-9b15-4ff9-b384-eb613c16ea3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6cd580c1-99d8-4d96-81ef-f27cef5d4abb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/746b3cf2-ff61-4a77-901f-b618679c5e06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 3, 0.228310502283105, 428.92694063926916, 136, 2980, 159.0, 1114.0, 1325.0, 1899.2499999999977, 5.104994269507955, 700.5146212533266, 3.7322295559839938], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2114.6842105263163, 1699, 2671, 2084.0, 2528.8, 2649.2999999999997, 2671.0, 0.2541001511227215, 305.7694586872718, 1.2494084579129907], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c6450c1f-a73e-4aca-94d5-d65607e53f6c", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["deleteBook", 10, 0, 0.0, 733.9000000000001, 437, 2381, 480.0, 2261.0000000000005, 2381.0, 2381.0, 0.05565232877169745, 0.010054375803480496, 0.03782619221201311], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 10, 0, 0.0, 733.9000000000001, 437, 2381, 480.0, 2261.0000000000005, 2381.0, 2381.0, 0.05556759520118248, 0.01003906749240113, 0.03776859986330371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 240.99999999999997, 137, 443, 149.0, 441.2, 443.0, 443.0, 0.134199166474066, 0.047106586756033374, 0.07590931584519381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 180.83333333333337, 139, 459, 150.0, 435.6, 459.0, 459.0, 0.13448190844770522, 0.09994212141474967, 0.06750361420128953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4891e14b-178f-4c56-9c97-20dfd5fa6da7", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 191.05555555555551, 137, 712, 145.0, 441.1000000000004, 712.0, 712.0, 0.13392059996428785, 2.221707296998691, 0.07822206918486996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 256.0, 138, 1291, 147.0, 528.7000000000012, 1291.0, 1291.0, 0.13334617407602214, 6.699784342658923, 0.07775633023920822], "isController": false}, {"data": ["goToProfile", 10, 0, 0.0, 270.6, 224, 332, 265.5, 330.6, 332.0, 332.0, 0.05547973325344252, 0.1435700636213841, 0.0358667806775185], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a96d6a80-b17b-4070-b3af-93c3d290f449", 3, 0, 0.0, 322.0, 262, 425, 279.0, 425.0, 425.0, 425.0, 0.019247919620687663, 0.02653481106562899, 0.012343229704672755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 146.37499999999997, 137, 155, 147.0, 152.2, 155.0, 155.0, 0.0905709935071919, 0.06730910747946585, 0.04546239322528968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 166.25000000000006, 136, 435, 146.5, 254.40000000000018, 435.0, 435.0, 0.0905730443298444, 0.032737644563069976, 0.0511795193118713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 993.0, 993, 993, 993.0, 993.0, 993.0, 993.0, 1.0070493454179255, 296.1059447381672, 0.5743328298086606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1026.0, 1026, 1026, 1026.0, 1026.0, 1026.0, 1026.0, 0.9746588693957114, 876.999763949805, 0.5549083211500975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 3.967558856502242, 1.2415043441704037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 21, 0, 0.0, 161.28571428571425, 139, 444, 148.0, 155.8, 415.2999999999996, 444.0, 0.10229680687824244, 0.0760233105804126, 0.05134820189005529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 21, 0, 0.0, 171.3809523809524, 138, 429, 147.0, 359.00000000000017, 427.2, 429.0, 0.10229880018121502, 0.03468949269537853, 0.057933165392803035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 21, 0, 0.0, 224.28571428571428, 138, 1224, 149.0, 436.40000000000003, 1145.7999999999988, 1224.0, 0.10229630856463665, 4.409420919168867, 0.05972041749072026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 21, 0, 0.0, 243.76190476190473, 138, 1030, 149.0, 446.0, 971.6999999999991, 1030.0, 0.10229680687824244, 1.4585762628784373, 0.059820607630854665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 153.0, 6.5359477124183005, 4.857281454248366, 3.6700878267973858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 808.2499999999998, 145, 1324, 1084.5, 1291.1000000000001, 1324.0, 1324.0, 0.07436291893047532, 41.827444405003696, 0.03972316079586914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 267.1875, 139, 1323, 149.0, 800.8000000000005, 1323.0, 1323.0, 0.0905709935071919, 5.116382178812614, 0.052759372682656215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 656.3125000000001, 142, 1180, 722.5, 1125.4, 1180.0, 1180.0, 0.07436499267969604, 13.673627007273826, 0.03979689061374358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 236.875, 139, 711, 148.5, 517.8000000000002, 711.0, 711.0, 0.09057253161547431, 1.6873445938104996, 0.05284871839867764], "isController": false}, {"data": ["deleteBooks", 10, 0, 0.0, 626.6, 422, 1054, 521.5, 1038.2, 1054.0, 1054.0, 0.0561611600649223, 0.010146303332041627, 0.03872048731038588], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 21, 0, 0.0, 443.33333333333326, 289, 1372, 301.0, 829.0000000000002, 1323.4999999999993, 1372.0, 0.10222211405067295, 5.9743653710419355, 0.22865447860637184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/332cd883-cff2-4c2b-9922-f803fda9c5f9", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 563.5, 186, 1086, 509.5, 1025.7, 1086.0, 1086.0, 0.08263134941584227, 0.05075695193609842, 0.03736163552688962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 165.12499999999997, 144, 433, 147.5, 235.6000000000002, 433.0, 433.0, 0.07436291893047532, 0.05526384893173019, 0.037326699541273746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 318.125, 142, 601, 419.5, 491.8000000000001, 601.0, 601.0, 0.07436464704679396, 0.08970598658647679, 0.03850767001617431], "isController": false}, {"data": ["login", 18, 0, 0.0, 2479.833333333333, 1208, 3881, 2423.5, 3863.0, 3881.0, 3881.0, 0.08698509655345717, 5.906043599165427, 0.13925543777666094], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cd580c1-99d8-4d96-81ef-f27cef5d4abb", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc196afb-8f01-4797-a0c2-7b6552dc1982", 1, 0, 0.0, 1054.0, 1054, 1054, 1054.0, 1054.0, 1054.0, 1054.0, 0.9487666034155597, 0.17140802893738138, 0.6541300996204933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 169.75, 143, 435, 151.5, 250.9000000000002, 435.0, 435.0, 0.0855637851279446, 0.06926990026471296, 0.030415251744699057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b37c8f91-51d5-4331-8d4f-37ec15251bc2", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1dc7b89-e416-4266-9b51-dc84f1049e83", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4891e14b-178f-4c56-9c97-20dfd5fa6da7", 3, 0, 0.0, 938.6666666666666, 233, 2145, 438.0, 2145.0, 2145.0, 2145.0, 0.06969774411634877, 0.03153641416722812, 0.044695493460028345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=746b3cf2-ff61-4a77-901f-b618679c5e06", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1029.375, 294, 1475, 1293.0, 1441.4, 1475.0, 1475.0, 0.07431076763022962, 55.60663312135412, 0.15524346645797726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c8cb963-78ce-49b4-af5a-8ec6756aacdf", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8955714c-a945-49e5-a1f0-4210a5b027ef", 3, 0, 0.0, 413.3333333333333, 230, 523, 487.0, 523.0, 523.0, 523.0, 0.03644270599239562, 0.03038078452035325, 0.023369834246425577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bb87cca-63b8-4f0d-a647-286daeb69779", 3, 0, 0.0, 341.0, 221, 470, 332.0, 470.0, 470.0, 470.0, 0.03506352341658972, 0.02254246704028799, 0.022485397503477132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11e40f31-9b15-4ff9-b384-eb613c16ea3d", 3, 0, 0.0, 449.33333333333337, 315, 715, 318.0, 715.0, 715.0, 715.0, 0.0297849526419253, 0.02483048949087588, 0.019100376531442982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 503.44444444444446, 290, 1436, 302.0, 927.5000000000008, 1436.0, 1436.0, 0.13319619058894916, 9.04767932230888, 0.297668049193793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1180.0, 1180, 1180, 1180.0, 1180.0, 1180.0, 1180.0, 0.847457627118644, 1013.8539459745763, 1.9109176377118644], "isController": false}, {"data": ["register", 20, 2, 10.0, 1169.2, 584, 2107, 974.0, 1875.7000000000005, 2096.7999999999997, 2107.0, 0.08130709282424253, 0.026075438753399655, 0.036683473520312544], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 468.74999999999994, 283, 1467, 310.5, 945.5000000000006, 1467.0, 1467.0, 0.0904936428215918, 6.897848098290236, 0.2020752207196507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 168.55555555555554, 146, 444, 152.0, 189.3000000000004, 444.0, 444.0, 0.1010588724075592, 0.07845879254297809, 0.03592327105112456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 666.7333333333332, 293, 1714, 580.0, 1571.8000000000002, 1714.0, 1714.0, 0.10420140046682227, 25.061413700400134, 0.22901921083069357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 178.55555555555554, 140, 419, 150.0, 419.0, 419.0, 419.0, 0.03994177376979337, 0.02968329085821558, 0.020048898161790812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 209.44444444444446, 140, 430, 149.0, 430.0, 430.0, 430.0, 0.03989308652810468, 0.017332022402184368, 0.022379259695128165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 292.66666666666663, 138, 1034, 148.0, 1034.0, 1034.0, 1034.0, 0.039943901010136874, 4.003080153262529, 0.023101236152780983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 310.44444444444446, 139, 1035, 148.0, 1035.0, 1035.0, 1035.0, 0.039889550267481595, 1.312762675458619, 0.02310875747375046], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1386.6315789473683, 1097, 2057, 1186.0, 1907.8, 1941.1999999999994, 2057.0, 0.24670091625585913, 295.1400629574246, 0.48713794205990935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 2, 10.0, 1169.2, 584, 2107, 974.0, 1875.7000000000005, 2096.7999999999997, 2107.0, 0.07776987117420839, 0.024941040716416056, 0.03508757859617606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 183.5, 146, 428, 149.0, 428.0, 428.0, 428.0, 0.03971169310803566, 0.010703542283025237, 0.023384913031392094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f7f56b0-c242-4cf6-951d-39f619b18cc8", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.5563343858885018, 1.0395116506968642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 251.50000000000006, 140, 438, 146.5, 438.0, 438.0, 438.0, 0.03976795398847724, 0.010718706348456754, 0.023379207325257126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 177.8888888888889, 141, 446, 148.0, 415.40000000000003, 446.0, 446.0, 0.09873184431085173, 0.026611317411909252, 0.058043525659309314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 210.3888888888889, 139, 444, 149.0, 443.1, 444.0, 444.0, 0.09873184431085173, 0.026611317411909252, 0.058139943476019126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 216.5, 141, 433, 148.0, 433.0, 433.0, 433.0, 0.03971189023633539, 0.01062603312964443, 0.022648187400410025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 165.38888888888889, 141, 447, 149.0, 187.8000000000004, 447.0, 447.0, 0.09872697056290827, 0.07337033652184882, 0.04955631139583482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 186.5, 142, 445, 150.5, 445.0, 445.0, 445.0, 0.03976775630318937, 0.029553967330788196, 0.019961549550624354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 160.8888888888889, 138, 414, 147.0, 178.2000000000004, 414.0, 414.0, 0.09873130275953991, 0.02641833687120502, 0.05630769610505011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 151.875, 148, 160, 150.5, 160.0, 160.0, 160.0, 0.03946057395404816, 0.031059787702112127, 0.014027000897728056], "isController": false}, {"data": ["deleteAccount", 10, 0, 0.0, 559.0, 425, 878, 513.0, 861.7, 878.0, 878.0, 0.05726819267310743, 0.010346304340356324, 0.03898040067691004], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 1308.2777777777778, 800, 2980, 1204.5, 2074.6000000000013, 2980.0, 2980.0, 0.08444717594569108, 0.04370801098751589, 0.03884240221720752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 476.875, 293, 878, 440.0, 878.0, 878.0, 878.0, 0.03968332705013988, 0.06150140627790234, 0.08924873261374233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c92b9820-97b9-41a7-b1a8-7fe83d540ae4", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.7826861213235294, 1.4624502144607845], "isController": false}, {"data": ["addBook", 64, 1, 1.5625, 1361.2499999999995, 755, 2758, 1130.5, 2093.5, 2424.5, 2758.0, 0.28564414987391484, 91.81377322950837, 1.0399057987994018], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 266.1228070175437, 138, 601, 150.0, 582.2, 599.1, 601.0, 0.248124915659294, 0.1843975203288308, 0.119943196534522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f44c010e-46c2-4bf4-b8c8-3e016e3a393f", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 843.5438596491229, 682, 1320, 738.0, 1034.2, 1144.6999999999998, 1320.0, 0.2480255857972717, 72.92775744892631, 0.12473943035702631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c199e05-f274-424d-85f5-0c9baa9a49de", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 221.9473684210526, 138, 582, 151.0, 444.0, 524.0999999999998, 582.0, 0.24863469020990006, 0.43996685416048714, 0.12091804269973654], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1116.719298245614, 947, 1518, 1032.0, 1349.0000000000002, 1443.8999999999999, 1518.0, 0.24736362452805624, 222.57822416921624, 0.12416494434318448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 152.19999999999996, 145, 162, 152.0, 160.8, 162.0, 162.0, 0.11300286273918939, 0.08442108397996081, 0.04016898636432123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 1, 0.5405405405405406, 222.51891891891896, 140, 1478, 154.0, 343.00000000000006, 428.8999999999999, 1131.4199999999946, 0.7623490239872089, 1.5457085222894371, 0.37053446332689116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 184.88888888888889, 145, 450, 153.0, 450.0, 450.0, 450.0, 0.041339966101227796, 0.03201425109206411, 0.014695066075045818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 153.55555555555557, 139, 178, 153.0, 162.70000000000002, 178.0, 178.0, 0.13685819210328232, 0.11106363050569103, 0.048648810474213634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bb87cca-63b8-4f0d-a647-286daeb69779", 1, 0, 0.0, 824.0, 824, 824, 824.0, 824.0, 824.0, 824.0, 1.2135922330097086, 0.21925250303398058, 0.8367149575242719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f44c010e-46c2-4bf4-b8c8-3e016e3a393f", 3, 0, 0.0, 362.6666666666667, 254, 541, 293.0, 541.0, 541.0, 541.0, 0.016813316146387938, 0.023178513632797174, 0.010781976825645911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 507.33333333333326, 295, 1186, 303.0, 1186.0, 1186.0, 1186.0, 0.039863048283009926, 5.353811544117321, 0.0885196704765406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a96d6a80-b17b-4070-b3af-93c3d290f449", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 394.88888888888886, 290, 893, 303.0, 623.0000000000005, 893.0, 893.0, 0.09864743407063156, 0.15288425573251202, 0.22186039127408644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc196afb-8f01-4797-a0c2-7b6552dc1982", 3, 0, 0.0, 535.3333333333334, 269, 872, 465.0, 872.0, 872.0, 872.0, 0.01870639072661857, 0.025788269767978402, 0.011995960199035998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1dc7b89-e416-4266-9b51-dc84f1049e83", 3, 0, 0.0, 376.3333333333333, 238, 632, 259.0, 632.0, 632.0, 632.0, 0.01766670003710007, 0.02435497221911419, 0.011329231469103886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8955714c-a945-49e5-a1f0-4210a5b027ef", 1, 0, 0.0, 896.0, 896, 896, 896.0, 896.0, 896.0, 896.0, 1.1160714285714286, 0.20163399832589285, 0.7694789341517857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 21, 0, 0.0, 163.76190476190476, 142, 421, 151.0, 158.6, 394.7999999999996, 421.0, 0.10847275525963729, 0.08993493087444536, 0.03855867472119919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11e40f31-9b15-4ff9-b384-eb613c16ea3d", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 156.625, 140, 251, 151.5, 187.30000000000007, 251.0, 251.0, 0.07522473389250385, 0.05840201508255915, 0.02674004212585098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cd580c1-99d8-4d96-81ef-f27cef5d4abb", 3, 0, 0.0, 397.3333333333333, 307, 539, 346.0, 539.0, 539.0, 539.0, 0.03973825734495457, 0.033128150084774946, 0.025483192372903807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/746b3cf2-ff61-4a77-901f-b618679c5e06", 3, 0, 0.0, 1095.6666666666667, 224, 2185, 878.0, 2185.0, 2185.0, 2185.0, 0.0202643826455827, 0.02395181425329127, 0.01299506308977797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 189.1333333333333, 140, 446, 150.0, 444.2, 446.0, 446.0, 0.1043064663055345, 0.07751681724464039, 0.05235695671977025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 240.73333333333332, 138, 443, 148.0, 443.0, 443.0, 443.0, 0.10431081842268135, 0.0592452851510073, 0.057737667853491985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 435.73333333333335, 141, 1326, 151.0, 1291.2, 1326.0, 1326.0, 0.104310093044603, 18.794172879636584, 0.059530096069595695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 380.06666666666666, 138, 1033, 149.0, 1026.4, 1033.0, 1033.0, 0.104310093044603, 6.156618019047023, 0.059631961394834565], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 66.66666666666667, 0.15220700152207], "isController": false}, {"data": ["401/Unauthorized", 1, 33.333333333333336, 0.076103500761035], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 3, "406/Not Acceptable", 2, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
