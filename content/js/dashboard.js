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

    var data = {"OkPercent": 98.28793774319067, "KoPercent": 1.7120622568093384};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8194259012016022, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4824561403508772, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b56d791d-ae01-48df-bfd6-2864dc08afcc"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5357cbaf-f61b-4481-9974-ab7314fb2802"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b69a622b-375b-471d-8d37-3a761686a3a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a7dfce9-07b4-40ef-8f82-3e06a0e47ac3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55191ffd-ea64-4775-8c27-4f4b990fa979"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d49783dc-a022-4538-81ba-c6eff9770a22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/089561f7-6784-4921-88f8-a159d030c94b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6bd15606-eab3-4126-ba6f-49a393b0f24c"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d49783dc-a022-4538-81ba-c6eff9770a22"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8458c391-3076-48e2-8f08-966968d8f867"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2f42aae-2859-4696-b3bd-0ed6aae478cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc4b31e6-a35e-4b70-9266-01ba0d61c50f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18842b50-9cb1-4f12-b6eb-fd85ca78ab6b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/60d4395b-c2c6-400e-ae0c-6d52a2138d6a"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f38520c-163b-4337-96b4-71414419cfbe"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82b5a83c-9c7f-4998-adcd-17acb624cdc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/18842b50-9cb1-4f12-b6eb-fd85ca78ab6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3867924528301887, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b69a622b-375b-471d-8d37-3a761686a3a3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9294478527607362, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70fb74e7-fd65-4246-bd0c-ab3dd012af9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55191ffd-ea64-4775-8c27-4f4b990fa979"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc4b31e6-a35e-4b70-9266-01ba0d61c50f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70fb74e7-fd65-4246-bd0c-ab3dd012af9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a7dfce9-07b4-40ef-8f82-3e06a0e47ac3"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8458c391-3076-48e2-8f08-966968d8f867"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2f42aae-2859-4696-b3bd-0ed6aae478cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f38520c-163b-4337-96b4-71414419cfbe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82b5a83c-9c7f-4998-adcd-17acb624cdc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bd15606-eab3-4126-ba6f-49a393b0f24c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60d4395b-c2c6-400e-ae0c-6d52a2138d6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 22, 1.7120622568093384, 287.2770428015563, 80, 2267, 115.0, 721.8000000000002, 889.2000000000007, 1458.400000000011, 5.147680339065887, 770.138308074397, 3.7595663041758303], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1215.4035087719299, 990, 1640, 1194.0, 1439.0, 1473.5999999999997, 1640.0, 0.2495130118846987, 300.2474055229377, 1.2268535301166583], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b56d791d-ae01-48df-bfd6-2864dc08afcc", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.6237030029296875, 1.1653900146484375], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 543.6428571428572, 88, 1057, 466.5, 947.0, 1057.0, 1057.0, 0.08594598908485938, 0.01622878016550742, 0.05812265375123547], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 543.6428571428572, 88, 1057, 466.5, 947.0, 1057.0, 1057.0, 0.0825403563385098, 0.015585710421899135, 0.05581952809025198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 132.99999999999997, 81, 249, 84.0, 248.2, 249.0, 249.0, 0.08398421096833794, 0.051581648803871026, 0.04626954651756239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5357cbaf-f61b-4481-9974-ab7314fb2802", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 96.61538461538461, 83, 244, 84.0, 181.19999999999993, 244.0, 244.0, 0.08407437348423606, 0.06248105295068715, 0.04220139450282943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 226.53846153846152, 81, 643, 89.0, 611.8, 643.0, 643.0, 0.08407546095988307, 5.72227237781572, 0.04784191832715702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 276.8461538461538, 80, 815, 245.0, 783.0, 815.0, 815.0, 0.08398529611277286, 17.456670602804465, 0.04770859444146548], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 205.2857142857143, 83, 363, 180.5, 330.0, 363.0, 363.0, 0.08640641876253664, 0.14621465630303965, 0.05585437239623515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b69a622b-375b-471d-8d37-3a761686a3a3", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 106.60000000000001, 82, 249, 85.0, 248.4, 249.0, 249.0, 0.15889830508474576, 0.11808750993114406, 0.07975950079449153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 149.60000000000002, 83, 251, 84.0, 249.8, 251.0, 251.0, 0.15890840519524546, 0.05843194482700171, 0.08973772829840879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 476.7142857142857, 400, 577, 412.0, 577.0, 577.0, 577.0, 0.05105017502917153, 15.010446483919194, 0.029114552946324385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 682.4285714285714, 569, 738, 723.0, 738.0, 738.0, 738.0, 0.0509925332362047, 45.88317104124931, 0.02903188171553451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 176.14285714285717, 81, 253, 243.0, 253.0, 253.0, 253.0, 0.05123138288139935, 0.0906555329893512, 0.028367377044681088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 85.3076923076923, 83, 100, 84.0, 94.8, 100.0, 100.0, 0.07221459957004538, 0.05366729518828568, 0.036248343924807934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 133.38461538461536, 82, 248, 85.0, 247.6, 248.0, 248.0, 0.07221500072215001, 0.019323154490106544, 0.04118511759935117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 95.76923076923076, 81, 247, 82.0, 182.99999999999994, 247.0, 247.0, 0.07221540187871146, 0.019464307537621447, 0.04245475774510185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a7dfce9-07b4-40ef-8f82-3e06a0e47ac3", 3, 0, 0.0, 677.6666666666666, 363, 1280, 390.0, 1280.0, 1280.0, 1280.0, 0.06707507937217726, 0.030349726669051558, 0.04301364139426732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 97.76923076923077, 81, 246, 84.0, 191.99999999999994, 246.0, 246.0, 0.07221500072215001, 0.019464199413391996, 0.042525044370562946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 107.0, 82, 248, 83.0, 248.0, 248.0, 248.0, 0.05123138288139935, 0.0380733226296337, 0.028767622223442018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 601.3333333333334, 84, 894, 729.0, 853.2000000000002, 894.0, 894.0, 0.20643030396862258, 154.79789855025717, 0.10657502021296726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 150.26666666666668, 82, 756, 85.0, 450.00000000000017, 756.0, 756.0, 0.1589050383490826, 9.572176737494173, 0.09250838886181617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 444.99999999999994, 83, 665, 491.0, 639.8000000000001, 665.0, 665.0, 0.206996481059822, 50.729163971399984, 0.10706946888152902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 117.2, 82, 427, 84.0, 317.20000000000005, 427.0, 427.0, 0.1589067217543302, 3.1548984652259127, 0.09266455122093331], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 365.21428571428567, 97, 826, 359.5, 736.0, 826.0, 826.0, 0.08290204531188933, 0.015654006463398748, 0.05673493070277248], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55191ffd-ea64-4775-8c27-4f4b990fa979", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d49783dc-a022-4538-81ba-c6eff9770a22", 3, 0, 0.0, 254.33333333333331, 160, 426, 177.0, 426.0, 426.0, 426.0, 0.08515711487694798, 0.039473870958585254, 0.05460921754804281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/089561f7-6784-4921-88f8-a159d030c94b", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 234.6923076923077, 167, 342, 174.0, 338.8, 342.0, 342.0, 0.07218091869652365, 0.11186632614392875, 0.16233657788876366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bd15606-eab3-4126-ba6f-49a393b0f24c", 3, 0, 0.0, 529.3333333333333, 167, 1158, 263.0, 1158.0, 1158.0, 1158.0, 0.07477008199785659, 0.034707726864890466, 0.04794826221867757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 412.9999999999999, 116, 980, 337.0, 852.2, 954.5999999999997, 980.0, 0.10336892819904361, 0.0634951717160141, 0.04673809937124726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 84.91666666666666, 82, 90, 84.5, 89.4, 90.0, 90.0, 0.20875010872401495, 0.15513557884665566, 0.10478276941810907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 186.58333333333334, 82, 332, 245.0, 309.2000000000001, 332.0, 332.0, 0.20875374017117806, 0.31713987805302346, 0.104444823777051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d49783dc-a022-4538-81ba-c6eff9770a22", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["login", 23, 0, 0.0, 2303.608695652174, 1477, 3487, 2214.0, 3320.6000000000004, 3468.2, 3487.0, 0.10272167784695364, 37.540642927445, 0.20682594621180317], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8458c391-3076-48e2-8f08-966968d8f867", 3, 0, 0.0, 443.66666666666663, 193, 845, 293.0, 845.0, 845.0, 845.0, 0.040781371069695364, 0.026218492142789172, 0.02615211621331376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 89.19999999999999, 84, 102, 88.0, 100.2, 102.0, 102.0, 0.1622568851004911, 0.1313583571760812, 0.057677252125565195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2f42aae-2859-4696-b3bd-0ed6aae478cb", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc4b31e6-a35e-4b70-9266-01ba0d61c50f", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18842b50-9cb1-4f12-b6eb-fd85ca78ab6b", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60d4395b-c2c6-400e-ae0c-6d52a2138d6a", 3, 0, 0.0, 654.0, 176, 1267, 519.0, 1267.0, 1267.0, 1267.0, 0.02048089132839061, 0.02823456210147599, 0.013133904920875489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 695.25, 169, 978, 814.0, 938.7000000000002, 978.0, 978.0, 0.2061324400927596, 205.55829548870565, 0.4196459245898823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 399.7692307692307, 167, 900, 331.0, 868.4, 900.0, 900.0, 0.08393866020984665, 23.273872578692494, 0.183823900322841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 633.0, 83, 970, 811.0, 970.0, 970.0, 970.0, 0.0655217350155432, 60.97138702232835, 0.12455954833683995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f38520c-163b-4337-96b4-71414419cfbe", 3, 0, 0.0, 247.33333333333334, 185, 363, 194.0, 363.0, 363.0, 363.0, 0.020434992881810814, 0.02415346977664553, 0.013104471346734148], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 887.875, 133, 1729, 908.5, 1635.0, 1710.25, 1729.0, 0.09976720984369804, 0.031177253076155636, 0.0450121591286997], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 102.15, 84, 250, 88.0, 185.20000000000022, 247.24999999999994, 250.0, 0.0969410259268774, 0.07526183165221437, 0.034459505309944696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 302.2666666666667, 167, 1005, 176.0, 699.6000000000001, 1005.0, 1005.0, 0.1587519976293035, 12.891137636659012, 0.35432908429201904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 278.7368421052631, 167, 823, 175.0, 494.0, 823.0, 823.0, 0.09275713253529654, 5.976704000395438, 0.2073638712799508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82b5a83c-9c7f-4998-adcd-17acb624cdc3", 3, 0, 0.0, 369.6666666666667, 204, 506, 399.0, 506.0, 506.0, 506.0, 0.043073123806515526, 0.027691868332639376, 0.027621762336860544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 115.0, 82, 252, 87.0, 250.6, 252.0, 252.0, 0.05378210424927516, 0.03996892708368984, 0.026996095296999447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 110.18181818181819, 81, 251, 83.0, 237.40000000000003, 251.0, 251.0, 0.05378420797864278, 0.021735237457278227, 0.03026316674082368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 180.27272727272728, 82, 812, 84.0, 700.4000000000003, 812.0, 812.0, 0.05378341906084371, 4.4126707394364475, 0.031198584884903482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 180.27272727272728, 82, 678, 85.0, 592.4000000000003, 678.0, 678.0, 0.053739539110170945, 1.449641242775696, 0.031225611104054404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 3.040431701030928, 6.372825386597938], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 783.4912280701753, 646, 1289, 667.0, 1085.2, 1107.1999999999996, 1289.0, 0.2539688197578831, 303.83500227792206, 0.501489212451601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 887.875, 133, 1729, 908.5, 1635.0, 1710.25, 1729.0, 0.10247039032679515, 0.03202199697712348, 0.046231758135722036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 86.42857142857143, 82, 100, 85.0, 100.0, 100.0, 100.0, 0.032384318587673606, 0.0087285858693339, 0.019070062605827328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 85.14285714285714, 82, 91, 85.0, 91.0, 91.0, 91.0, 0.03238416876778238, 0.008728545488191344, 0.019038349216997062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 117.3, 81, 260, 83.5, 251.8, 259.6, 260.0, 0.09773164843971423, 0.026341733368516727, 0.05745551988350388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18842b50-9cb1-4f12-b6eb-fd85ca78ab6b", 3, 0, 0.0, 614.0, 166, 1139, 537.0, 1139.0, 1139.0, 1139.0, 0.030581351491860267, 0.025494414443572307, 0.01961108803351716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 132.85000000000002, 81, 371, 84.5, 249.9, 364.94999999999993, 371.0, 0.09773069330153827, 0.026341475928930238, 0.05755039849690194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 102.25, 82, 247, 84.5, 231.40000000000032, 246.95, 247.0, 0.09773021573945125, 0.07262958415793203, 0.049055987197341736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 85.71428571428572, 82, 92, 85.0, 92.0, 92.0, 92.0, 0.032384318587673606, 0.008665335247092351, 0.018469181694532603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 92.50000000000001, 81, 247, 82.5, 112.90000000000006, 240.4499999999999, 247.0, 0.09773117086829258, 0.026150723454992354, 0.055737308385823116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 88.0, 84, 95, 85.0, 95.0, 95.0, 95.0, 0.03238401894927737, 0.024066639082421955, 0.016255259511648995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 90.14285714285714, 86, 98, 90.0, 98.0, 98.0, 98.0, 0.03207095928820797, 0.02524335272099182, 0.011400223809480177], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 589.6428571428571, 83, 1918, 426.0, 1538.0, 1918.0, 1918.0, 0.08215094649626213, 0.01535172891067845, 0.05591146658510251], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1269.4782608695655, 626, 2267, 1045.0, 2035.2, 2228.7999999999993, 2267.0, 0.10183209216247088, 0.052706063326278876, 0.046838784578636515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 176.42857142857142, 167, 190, 175.0, 190.0, 190.0, 190.0, 0.03237128944094783, 0.0501691761160002, 0.07280378865478794], "isController": false}, {"data": ["addBook", 53, 10, 18.867924528301888, 872.5849056603772, 440, 2543, 736.0, 1382.0000000000002, 1500.4999999999993, 2543.0, 0.25999892075919684, 94.96894135828586, 0.9410014005602241], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 148.8070175438597, 82, 354, 86.0, 340.2, 342.1, 354.0, 0.25479643106192, 0.18935555081847766, 0.1231681966559086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b69a622b-375b-471d-8d37-3a761686a3a3", 3, 0, 0.0, 850.6666666666666, 297, 1918, 337.0, 1918.0, 1918.0, 1918.0, 0.045627376425855515, 0.028918132129277567, 0.029259743346007606], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 475.0526315789474, 401, 672, 419.0, 580.2, 591.0999999999996, 672.0, 0.2547759312730751, 74.91258315137713, 0.12813437949768913], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 132.15789473684208, 81, 265, 89.0, 250.60000000000002, 258.1, 265.0, 0.2549559865454806, 0.4511525855668074, 0.12399226689418878], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 632.4912280701753, 560, 902, 574.0, 743.2, 764.7999999999996, 902.0, 0.2544074983262664, 228.9163141946552, 0.1277006388083017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 90.57894736842104, 86, 108, 88.0, 100.0, 108.0, 108.0, 0.09436679878018496, 0.0704986338543374, 0.03354444800389387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 10, 6.134969325153374, 145.79141104294476, 83, 1553, 91.0, 250.6, 341.19999999999993, 1186.2799999999916, 0.6804709025632463, 1.601209447013025, 0.3220161233510061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 106.0, 85, 259, 88.0, 227.2000000000001, 259.0, 259.0, 0.056939354411247076, 0.044094636765741144, 0.020240161138372986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70fb74e7-fd65-4246-bd0c-ab3dd012af9b", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55191ffd-ea64-4775-8c27-4f4b990fa979", 3, 0, 0.0, 316.3333333333333, 237, 426, 286.0, 426.0, 426.0, 426.0, 0.039459146630188874, 0.025368429230020518, 0.02530420535855211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 88.53846153846155, 84, 103, 87.0, 98.6, 103.0, 103.0, 0.08439202040988555, 0.06848610250060048, 0.029998726005076505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc4b31e6-a35e-4b70-9266-01ba0d61c50f", 3, 0, 0.0, 734.3333333333334, 184, 1659, 360.0, 1659.0, 1659.0, 1659.0, 0.02282149785097562, 0.022888357707960896, 0.014634879806777983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70fb74e7-fd65-4246-bd0c-ab3dd012af9b", 3, 0, 0.0, 289.6666666666667, 166, 374, 329.0, 374.0, 374.0, 374.0, 0.10052271813429835, 0.045483912176651924, 0.0644628107827369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a7dfce9-07b4-40ef-8f82-3e06a0e47ac3", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 0.550805068597561, 2.1019912347560976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 324.3636363636364, 167, 899, 205.0, 820.0000000000002, 899.0, 899.0, 0.05371618322101768, 5.917793256787772, 0.11955951966744799], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8458c391-3076-48e2-8f08-966968d8f867", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.5206457132564842, 1.9868966138328532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 253.89999999999998, 166, 500, 171.5, 494.50000000000006, 499.85, 500.0, 0.09769011717929556, 0.15140060152689652, 0.2197073631483571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2f42aae-2859-4696-b3bd-0ed6aae478cb", 3, 0, 0.0, 268.3333333333333, 167, 457, 181.0, 457.0, 457.0, 457.0, 0.020469990993203964, 0.02419483635948033, 0.013126914797074155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 111.76923076923077, 84, 249, 87.0, 247.8, 249.0, 249.0, 0.0719771002087336, 0.059676326247280094, 0.02558560983982327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f38520c-163b-4337-96b4-71414419cfbe", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82b5a83c-9c7f-4998-adcd-17acb624cdc3", 1, 0, 0.0, 826.0, 826, 826, 826.0, 826.0, 826.0, 826.0, 1.2106537530266344, 0.21872162530266345, 0.8346890133171914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 108.08333333333333, 83, 249, 89.0, 218.4000000000001, 249.0, 249.0, 0.22888096282591697, 0.17769566938144918, 0.08136002975452516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bd15606-eab3-4126-ba6f-49a393b0f24c", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 93.89473684210526, 82, 244, 84.0, 109.0, 244.0, 244.0, 0.09287229570538952, 0.06901935257011858, 0.04661753905524435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 118.42105263157893, 82, 254, 84.0, 248.0, 254.0, 254.0, 0.09279699923808779, 0.03216606511418915, 0.052513104523609515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 152.4736842105263, 82, 737, 84.0, 249.0, 737.0, 737.0, 0.09287501955263569, 4.422089200651592, 0.05418027713417019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60d4395b-c2c6-400e-ae0c-6d52a2138d6a", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 157.57894736842107, 81, 421, 84.0, 335.0, 421.0, 421.0, 0.09279971867032655, 1.4598116928866574, 0.0542269737645427], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 36.36363636363637, 0.622568093385214], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07782101167315175], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07782101167315175], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.933852140077821], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 22, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
