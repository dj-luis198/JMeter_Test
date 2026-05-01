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

    var data = {"OkPercent": 97.34708916728077, "KoPercent": 2.6529108327192334};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7218021424070573, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4437db7d-f966-44bf-abc8-47c341c2a8b5"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4126c96e-bd8a-4a35-b80e-688cefc40a0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0516479e-6e96-41fd-90d5-cc6c6b4ab71b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7622700-e116-43be-9011-8134e7158d77"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12e146f8-4222-4f2e-8350-2ce53996f423"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10a8c477-39ed-455e-abbe-c340550e03e2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0a7bbfb0-1f72-4dfb-a698-29f5ab114820"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82afad92-59f5-4315-8e4e-1ce6cc2230b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7facb17b-9590-462a-94d5-f9136d74bc4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb82bd30-398b-4332-8235-902d76c733da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb95c934-7b72-4df5-9c58-55e9c1dc8bd8"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a7bbfb0-1f72-4dfb-a698-29f5ab114820"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0516479e-6e96-41fd-90d5-cc6c6b4ab71b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe2d78e9-3b66-4589-86c7-c4b55c76af80"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4437db7d-f966-44bf-abc8-47c341c2a8b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7622700-e116-43be-9011-8134e7158d77"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/735622d8-0dd8-4b09-85a5-8283dea6baa5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82afad92-59f5-4315-8e4e-1ce6cc2230b2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10a8c477-39ed-455e-abbe-c340550e03e2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7facb17b-9590-462a-94d5-f9136d74bc4a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e03939d-f35e-422b-a217-b9540eec5f2d"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12e146f8-4222-4f2e-8350-2ce53996f423"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8967391304347826, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb82bd30-398b-4332-8235-902d76c733da"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/775a5884-35d5-41cc-8257-90adfe9be0c4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9e03939d-f35e-422b-a217-b9540eec5f2d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4126c96e-bd8a-4a35-b80e-688cefc40a0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe2d78e9-3b66-4589-86c7-c4b55c76af80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb95c934-7b72-4df5-9c58-55e9c1dc8bd8"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 36, 2.6529108327192334, 476.0206337509211, 136, 2652, 160.0, 1330.2, 1690.7999999999993, 2143.300000000001, 5.3285061334757415, 717.4705347071972, 3.897683393182496], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2411.6481481481483, 1714, 3278, 2417.0, 2911.0, 2988.0, 3278.0, 0.23397590048225034, 281.55054326279395, 1.1504576747345023], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4437db7d-f966-44bf-abc8-47c341c2a8b5", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 566.9999999999999, 153, 1574, 545.5, 1161.0000000000005, 1574.0, 1574.0, 0.08876264867743652, 0.017937813096374045, 0.05953446937966004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 566.9999999999999, 153, 1574, 545.5, 1161.0000000000005, 1574.0, 1574.0, 0.09109179206021167, 0.01840850363228521, 0.06109666155698646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4126c96e-bd8a-4a35-b80e-688cefc40a0b", 3, 0, 0.0, 355.6666666666667, 235, 487, 345.0, 487.0, 487.0, 487.0, 0.032341177865697866, 0.02696150928191805, 0.020739622524552345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 221.6, 143, 430, 149.0, 428.8, 430.0, 430.0, 0.07959671000265323, 0.021298338418678696, 0.04539499867338817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 167.53333333333333, 143, 424, 149.0, 269.2000000000001, 424.0, 424.0, 0.07958995256438828, 0.05914839248193308, 0.03995042540829646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 250.8666666666667, 139, 573, 149.0, 493.80000000000007, 573.0, 573.0, 0.0795971323806441, 0.02145391458697048, 0.04687213947805507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 232.0, 142, 593, 148.0, 495.20000000000005, 593.0, 593.0, 0.07959882193743532, 0.021454369975324367, 0.046795401178062565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0516479e-6e96-41fd-90d5-cc6c6b4ab71b", 3, 0, 0.0, 938.0, 232, 1596, 986.0, 1596.0, 1596.0, 1596.0, 0.021039196022189337, 0.02486761743377913, 0.013491932344958657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7622700-e116-43be-9011-8134e7158d77", 3, 0, 0.0, 390.0, 234, 620, 316.0, 620.0, 620.0, 620.0, 0.031075523881540102, 0.02544106203192492, 0.019927988947472004], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 283.375, 148, 513, 279.0, 414.30000000000007, 513.0, 513.0, 0.08921352700103154, 0.16552202110457498, 0.05765881576012713], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/12e146f8-4222-4f2e-8350-2ce53996f423", 3, 0, 0.0, 332.6666666666667, 251, 450, 297.0, 450.0, 450.0, 450.0, 0.03416778661078335, 0.028484277835356824, 0.02191098295027448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10a8c477-39ed-455e-abbe-c340550e03e2", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a7bbfb0-1f72-4dfb-a698-29f5ab114820", 3, 0, 0.0, 473.3333333333333, 365, 536, 519.0, 536.0, 536.0, 536.0, 0.09746905357548978, 0.0441022084863056, 0.06250456886188635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 169.0, 144, 441, 146.5, 300.5, 441.0, 441.0, 0.0749288176232579, 0.05568440450322194, 0.03761075415854938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 146.21428571428572, 140, 153, 145.0, 151.5, 153.0, 153.0, 0.07493202594789013, 0.02808905604380312, 0.04228516252221199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 939.9999999999999, 714, 1322, 877.0, 1322.0, 1322.0, 1322.0, 0.059065001033637515, 17.36707144650188, 0.0336855084019964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1598.3750000000002, 1265, 2059, 1594.5, 2059.0, 2059.0, 2059.0, 0.05870956378794105, 52.82696869679445, 0.033425464539423466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82afad92-59f5-4315-8e4e-1ce6cc2230b2", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 328.625, 143, 444, 430.0, 444.0, 444.0, 444.0, 0.05925530890533224, 0.10485412083638869, 0.03281031264582362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 146.2142857142857, 142, 150, 146.0, 150.0, 150.0, 150.0, 0.09202837103209818, 0.0683921780814714, 0.046193928428221155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 185.35714285714286, 136, 429, 145.5, 427.5, 429.0, 429.0, 0.09202655623479919, 0.024624293367514625, 0.05248389535265891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 269.7857142857143, 139, 445, 149.0, 442.5, 445.0, 445.0, 0.09185628428207752, 0.024758139122903706, 0.05400144837676823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 165.57142857142856, 142, 427, 145.5, 288.5, 427.0, 427.0, 0.09202958093672967, 0.024804847986852917, 0.05419320049301561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7facb17b-9590-462a-94d5-f9136d74bc4a", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 184.0, 144, 441, 148.0, 441.0, 441.0, 441.0, 0.05938639012404332, 0.04413383094179391, 0.03334684992316885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 304.0, 142, 1767, 148.0, 1105.0, 1767.0, 1767.0, 0.07481350063057093, 4.827104204852724, 0.04352292098625569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 1077.0555555555554, 138, 2065, 1573.0, 1989.4, 2065.0, 2065.0, 0.0823082902739037, 41.154939997827974, 0.04445862293657689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 259.7142857142857, 142, 710, 146.5, 654.0, 710.0, 710.0, 0.07481949796116869, 1.590112653446774, 0.04359947586269553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 682.3888888888888, 139, 1290, 850.0, 1272.0, 1290.0, 1290.0, 0.08231017216544344, 13.455373168027071, 0.044540020463223355], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 438.75000000000006, 155, 1007, 492.5, 758.5000000000002, 1007.0, 1007.0, 0.09110527784262701, 0.018411228939022098, 0.06159504166642941], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 418.49999999999994, 288, 591, 299.5, 590.5, 591.0, 591.0, 0.09176657205970071, 0.1422202635339307, 0.20638517134129952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb82bd30-398b-4332-8235-902d76c733da", 3, 0, 0.0, 356.6666666666667, 262, 452, 356.0, 452.0, 452.0, 452.0, 0.026911380822950026, 0.031808341070355316, 0.017257623769925633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb95c934-7b72-4df5-9c58-55e9c1dc8bd8", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 516.2608695652174, 162, 1008, 455.0, 985.4, 1004.1999999999999, 1008.0, 0.0966134872428191, 0.05934558933177071, 0.04368363729826684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 160.77777777777777, 139, 427, 146.0, 179.5000000000004, 427.0, 427.0, 0.08230866664532739, 0.06116884308309975, 0.041315092437205346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 196.6111111111111, 137, 448, 147.5, 448.0, 448.0, 448.0, 0.08230791390592206, 0.09070303533295837, 0.04310091064561413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a7bbfb0-1f72-4dfb-a698-29f5ab114820", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["login", 23, 0, 0.0, 2854.869565217391, 1671, 5255, 2588.0, 4713.200000000001, 5185.199999999999, 5255.0, 0.09963654321843363, 41.5943732022102, 0.20779752744336963], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 152.85714285714283, 144, 178, 151.5, 169.5, 178.0, 178.0, 0.06932992626267129, 0.05612745007007275, 0.024644622226183934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1240.6666666666665, 280, 2212, 1717.0, 2137.3, 2212.0, 2212.0, 0.08225262522962191, 54.72484212065547, 0.17329635677990113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 507.2000000000001, 295, 866, 573.0, 797.6, 866.0, 866.0, 0.07952665733553888, 0.12325078631982439, 0.17885731625365822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 1082.8571428571427, 148, 2204, 1444.5, 2135.5, 2204.0, 2204.0, 0.10263177186423282, 70.17364356535445, 0.1613858840077707], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1123.9999999999998, 239, 2128, 1155.0, 1953.5, 2104.0, 2128.0, 0.09590562886120058, 0.02997050901912518, 0.04326992239636198], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 528.5714285714284, 288, 1914, 305.0, 1399.5, 1914.0, 1914.0, 0.07475118534022468, 6.495317997882939, 0.16675103984238177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 155.76190476190476, 143, 237, 151.0, 166.8, 230.1999999999999, 237.0, 0.10371497150307689, 0.08052090072748644, 0.036867431276484355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0516479e-6e96-41fd-90d5-cc6c6b4ab71b", 1, 0, 0.0, 1007.0, 1007, 1007, 1007.0, 1007.0, 1007.0, 1007.0, 0.9930486593843098, 0.1794082050645482, 0.684660501489573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe2d78e9-3b66-4589-86c7-c4b55c76af80", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 472.65, 284, 2007, 297.5, 849.6000000000003, 1949.7999999999993, 2007.0, 0.1168394917482109, 7.161057077917335, 0.2612800314006134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 180.66666666666666, 142, 444, 149.0, 444.0, 444.0, 444.0, 0.04615787017329716, 0.03430287031433509, 0.0231690871768308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 208.33333333333334, 143, 429, 146.0, 429.0, 429.0, 429.0, 0.04615787017329716, 0.012350836354964279, 0.026324410333208537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4437db7d-f966-44bf-abc8-47c341c2a8b5", 3, 0, 0.0, 404.0, 356, 484, 372.0, 484.0, 484.0, 484.0, 0.019933819718534466, 0.027480379722654123, 0.01278308100439873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 210.55555555555554, 143, 441, 148.0, 441.0, 441.0, 441.0, 0.046090265223870656, 0.012422766798621388, 0.027096034828877087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 227.88888888888889, 143, 591, 147.0, 591.0, 591.0, 591.0, 0.04608672497490834, 0.012421812590893264, 0.027138960117060282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 162.33333333333334, 155, 176, 156.0, 176.0, 176.0, 176.0, 0.06741118576275756, 0.019881033301125766, 0.04167117244904838], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1651.2777777777778, 1095, 2652, 1564.5, 2199.5, 2368.0, 2652.0, 0.22943575798776344, 274.48493132860295, 0.45304599868286877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7622700-e116-43be-9011-8134e7158d77", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1123.9999999999998, 239, 2128, 1155.0, 1953.5, 2104.0, 2128.0, 0.09486803461102129, 0.029646260815944153, 0.04280178905301937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 218.125, 142, 442, 147.5, 442.0, 442.0, 442.0, 0.07413379296284969, 0.019981373884518084, 0.043654958160740595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/735622d8-0dd8-4b09-85a5-8283dea6baa5", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.8944984243697479, 1.671371673669468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 218.0, 142, 442, 147.5, 442.0, 442.0, 442.0, 0.0739392034899304, 0.019928925940645305, 0.043468164551697365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 344.3333333333333, 140, 1423, 150.0, 1139.8000000000006, 1411.9999999999998, 1423.0, 0.10633988251974884, 9.138771568639863, 0.061645878696576874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82afad92-59f5-4315-8e4e-1ce6cc2230b2", 3, 0, 0.0, 341.6666666666667, 223, 464, 338.0, 464.0, 464.0, 464.0, 0.06805190091643226, 0.0307917129797659, 0.04364005364758189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 335.2380952380953, 142, 1137, 151.0, 994.0000000000005, 1136.5, 1137.0, 0.1063388055620259, 3.0037547725868685, 0.06174910086742083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 188.2857142857143, 143, 442, 149.0, 430.4, 440.9, 442.0, 0.10633665171202009, 0.07902557807895244, 0.05337601462888509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 215.25, 141, 428, 145.5, 428.0, 428.0, 428.0, 0.0739392034899304, 0.019784513433829035, 0.042168451990350936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10a8c477-39ed-455e-abbe-c340550e03e2", 3, 0, 0.0, 409.3333333333333, 225, 588, 415.0, 588.0, 588.0, 588.0, 0.03218469724928121, 0.03227898835450371, 0.02063927525425911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 233.0, 139, 578, 145.0, 442.6, 564.4999999999998, 578.0, 0.1063404210067906, 0.04366563976422809, 0.05979670623205505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 148.125, 144, 153, 148.5, 153.0, 153.0, 153.0, 0.07413035823495617, 0.05509101818047035, 0.03720996497340573], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 534.4375, 148, 1596, 485.5, 956.9000000000007, 1596.0, 1596.0, 0.08889679082585118, 0.0175091518551649, 0.060492573298182056], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 152.24999999999997, 150, 156, 152.5, 156.0, 156.0, 156.0, 0.07933359777865927, 0.062444218564061876, 0.028200614835382783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1488.8260869565215, 1061, 2591, 1374.0, 2185.2000000000003, 2523.999999999999, 2591.0, 0.09888220120378333, 0.05117926429492691, 0.04548194996775581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 440.0, 294, 591, 439.0, 591.0, 591.0, 591.0, 0.0738375205360604, 0.11443373544016391, 0.1660623142524874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7facb17b-9590-462a-94d5-f9136d74bc4a", 3, 0, 0.0, 408.0, 234, 683, 307.0, 683.0, 683.0, 683.0, 0.027382756165683933, 0.03284682827817229, 0.017559905483853302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e03939d-f35e-422b-a217-b9540eec5f2d", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["addBook", 65, 16, 24.615384615384617, 1391.1846153846159, 734, 4177, 1154.0, 2639.6, 2772.5999999999995, 4177.0, 0.3011448135913604, 78.77639306260801, 1.097115438073044], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 275.1111111111111, 140, 825, 150.0, 577.0, 600.25, 825.0, 0.2307357050684943, 0.17147448394250409, 0.11153727930557099], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12e146f8-4222-4f2e-8350-2ce53996f423", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 910.1481481481483, 684, 1331, 854.5, 1215.5, 1285.25, 1331.0, 0.23071993163853877, 67.83932052446058, 0.11603590311899166], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 226.7407407407407, 138, 445, 149.0, 436.0, 444.0, 445.0, 0.2313555291829294, 0.4093908387494805, 0.11251470071591682], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1370.925925925926, 949, 1865, 1413.0, 1722.5, 1771.5, 1865.0, 0.23027816749751598, 207.2046999001062, 0.11558884579465158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 167.10000000000002, 146, 437, 151.5, 167.0, 423.49999999999983, 437.0, 0.11596085161649428, 0.0866309096549005, 0.0412204589730507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 16, 8.695652173913043, 214.42934782608694, 138, 2303, 153.0, 361.0, 429.75, 848.6500000000098, 0.7676261994159366, 1.565527058562787, 0.37271931711514394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 149.77777777777777, 143, 157, 151.0, 157.0, 157.0, 157.0, 0.044644628755109335, 0.03457342832304853, 0.015869770377792768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 151.0666666666667, 145, 162, 151.0, 160.8, 162.0, 162.0, 0.08048030646900703, 0.06531165495678208, 0.028608233940154843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 474.6666666666667, 290, 1035, 302.0, 1035.0, 1035.0, 1035.0, 0.04605300188817308, 0.07137315819973698, 0.10357428061373301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb82bd30-398b-4332-8235-902d76c733da", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 597.1428571428572, 288, 1756, 576.0, 1457.4000000000003, 1737.3999999999996, 1756.0, 0.10625594527312837, 12.255568831399644, 0.23638291322178145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/775a5884-35d5-41cc-8257-90adfe9be0c4", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e03939d-f35e-422b-a217-b9540eec5f2d", 3, 0, 0.0, 474.0, 287, 622, 513.0, 622.0, 622.0, 622.0, 0.02987601453966041, 0.02996354192600707, 0.019158772344769207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4126c96e-bd8a-4a35-b80e-688cefc40a0b", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.277092120398773, 1.0574434432515336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 173.35714285714283, 145, 432, 152.0, 301.0, 432.0, 432.0, 0.09831046444672276, 0.08150935968287852, 0.03494629790879598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe2d78e9-3b66-4589-86c7-c4b55c76af80", 3, 0, 0.0, 376.33333333333337, 236, 644, 249.0, 644.0, 644.0, 644.0, 0.029898047657487967, 0.029985639593984516, 0.01917290165535524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 168.66666666666663, 142, 446, 151.5, 198.5000000000004, 446.0, 446.0, 0.08203819333667563, 0.0636917614283761, 0.029162014037646417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 176.20000000000002, 138, 450, 147.0, 415.2000000000006, 449.7, 450.0, 0.11693991627101995, 0.08690554324438104, 0.058698356409476814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 203.35000000000002, 138, 443, 147.0, 438.1, 442.8, 443.0, 0.11694401889815345, 0.0400738830384395, 0.06620356226099566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb95c934-7b72-4df5-9c58-55e9c1dc8bd8", 3, 0, 0.0, 357.0, 248, 479, 344.0, 479.0, 479.0, 479.0, 0.08125897234486307, 0.036767568866979065, 0.052109432135214934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 256.80000000000007, 136, 1562, 145.5, 429.5, 1505.3999999999992, 1562.0, 0.11694333510697391, 5.2912348138115926, 0.06824739947258555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 244.5, 141, 878, 147.0, 564.7000000000003, 863.0999999999998, 878.0, 0.11694128378141336, 1.7491743762644276, 0.06836040280425199], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.22222222222222, 0.5895357406042742], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.333333333333334, 0.2210759027266028], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.2210759027266028], "isController": false}, {"data": ["401/Unauthorized", 22, 61.111111111111114, 1.621223286661754], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 36, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
