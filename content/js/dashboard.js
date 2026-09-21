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

    var data = {"OkPercent": 97.35408560311284, "KoPercent": 2.6459143968871595};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7275449101796407, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37ed2de9-a0a8-49d8-b83f-17974dd2d132"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f055eeba-d8b6-4d6c-a299-34502c857af8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0aa89df1-afb0-4e8c-a6f7-b52f726dd0d8"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8afbd552-f62d-4256-81d2-3a85562ca46a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70837c8b-f750-4576-b82e-26ef4b4c9409"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/673cea70-cd25-40fa-a0bf-56c1044ab697"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=673cea70-cd25-40fa-a0bf-56c1044ab697"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cdf6b699-c6c2-4711-b118-cb7e99a0e8e9"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed4d5f23-3815-4be4-9cbb-62dfdc6178c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f2d13689-e54f-4cc6-89f7-4e56a136459d"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17a57d8d-530f-46c7-a363-b787dd369d8b"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37ed2de9-a0a8-49d8-b83f-17974dd2d132"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e2a49ca-9c9d-4072-8b68-85966d9a687c"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddef1ffc-bb7b-42ab-a297-69bb2401373a"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6bff4a2-d30c-4210-add3-f1724312e92c"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f055eeba-d8b6-4d6c-a299-34502c857af8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8afbd552-f62d-4256-81d2-3a85562ca46a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3148148148148148, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/39d7c1bf-9984-41f1-8535-82c00e62f9aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.20175438596491227, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/737f0339-ae7e-4fb3-a48d-e39dd4e20426"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4351851851851852, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8839285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17a57d8d-530f-46c7-a363-b787dd369d8b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdf6b699-c6c2-4711-b118-cb7e99a0e8e9"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39d7c1bf-9984-41f1-8535-82c00e62f9aa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70837c8b-f750-4576-b82e-26ef4b4c9409"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b289ace4-2c0f-4bb6-8fa5-cb2bbae85a2c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ed4d5f23-3815-4be4-9cbb-62dfdc6178c9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6bff4a2-d30c-4210-add3-f1724312e92c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ddef1ffc-bb7b-42ab-a297-69bb2401373a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3e2a49ca-9c9d-4072-8b68-85966d9a687c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2d13689-e54f-4cc6-89f7-4e56a136459d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 34, 2.6459143968871595, 450.35875486381286, 126, 2514, 155.0, 1260.0, 1446.4, 2017.1600000000094, 4.964245840271044, 705.6926383022956, 3.62299326518924], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2157.12962962963, 1552, 3055, 2095.5, 2681.5, 2881.75, 3055.0, 0.23821287408243932, 286.65095651843063, 1.1712908408252753], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37ed2de9-a0a8-49d8-b83f-17974dd2d132", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 0.5827872983870968, 2.2240423387096775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f055eeba-d8b6-4d6c-a299-34502c857af8", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0aa89df1-afb0-4e8c-a6f7-b52f726dd0d8", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.4392516334250344, 0.82074234869326], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 624.4, 130, 1624, 507.0, 1355.2000000000003, 1624.0, 1624.0, 0.09205616653574233, 0.018033659186591715, 0.06198208817139631], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 624.4, 130, 1624, 507.0, 1355.2000000000003, 1624.0, 1624.0, 0.09176837661741764, 0.01797728159126365, 0.06178831712092012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8afbd552-f62d-4256-81d2-3a85562ca46a", 3, 0, 0.0, 344.3333333333333, 252, 463, 318.0, 463.0, 463.0, 463.0, 0.03668333720546337, 0.03003209409887382, 0.023524145278243112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70837c8b-f750-4576-b82e-26ef4b4c9409", 3, 0, 0.0, 339.0, 253, 508, 256.0, 508.0, 508.0, 508.0, 0.0983380863408398, 0.04443140098993673, 0.06306185875372865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 183.06666666666666, 127, 396, 132.0, 390.6, 396.0, 396.0, 0.09825241700945844, 0.03612823250451961, 0.05548447038672151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 187.4666666666667, 128, 421, 133.0, 404.8, 421.0, 421.0, 0.09809435368900166, 0.07290019839583034, 0.04923876737904967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 224.1333333333333, 127, 1003, 132.0, 637.6000000000003, 1003.0, 1003.0, 0.09824469478648153, 1.950528167572701, 0.05729021687516374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 290.2666666666667, 128, 1389, 144.0, 810.0000000000003, 1389.0, 1389.0, 0.09824083413017565, 5.9178653924557585, 0.057192027265106166], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 246.46666666666667, 126, 482, 239.0, 363.80000000000007, 482.0, 482.0, 0.09174929200129672, 0.15004832129378734, 0.059302537173754805], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 145.99999999999997, 128, 386, 131.0, 154.0, 386.0, 386.0, 0.10644555869912323, 0.07910651383792262, 0.053430680831395835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/673cea70-cd25-40fa-a0bf-56c1044ab697", 3, 0, 0.0, 435.3333333333333, 369, 482, 455.0, 482.0, 482.0, 482.0, 0.06399726944983682, 0.028957097830492565, 0.04103991563026644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 992.0, 753, 1282, 1004.0, 1282.0, 1282.0, 1282.0, 0.031011873117136275, 9.118520387537657, 0.01768645888711678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 171.15789473684208, 127, 397, 132.0, 382.0, 397.0, 397.0, 0.1064413844102587, 0.03689559500733885, 0.060234356617853015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1239.1428571428573, 1119, 1448, 1143.0, 1448.0, 1448.0, 1448.0, 0.030955097420113736, 27.853451071875526, 0.017623849410084286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 316.57142857142856, 128, 397, 387.0, 397.0, 397.0, 397.0, 0.031136989408975458, 0.05509787579010111, 0.017240891596571373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 148.4375, 127, 396, 131.0, 221.70000000000016, 396.0, 396.0, 0.07914875513848559, 0.058820510410534696, 0.03972896498162265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 147.43749999999997, 126, 394, 130.5, 219.00000000000017, 394.0, 394.0, 0.07915071285110761, 0.021178999337112783, 0.04514064092289732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 147.75000000000003, 126, 388, 130.5, 221.40000000000018, 388.0, 388.0, 0.07915149596327371, 0.021333801646351114, 0.04653242243153395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 204.375, 127, 521, 130.5, 437.0000000000001, 521.0, 521.0, 0.07915149596327371, 0.021333801646351114, 0.04660971881431059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 168.42857142857144, 127, 382, 133.0, 382.0, 382.0, 382.0, 0.031136158420774045, 0.023139273982626024, 0.017483682706977616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 718.2105263157895, 126, 1445, 513.0, 1428.0, 1445.0, 1445.0, 0.0884428473010967, 37.70882349047843, 0.0483944568445454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 247.15789473684217, 127, 1307, 132.0, 395.0, 1307.0, 1307.0, 0.1064443660117537, 5.068171007425895, 0.06209619419373995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 629.7894736842105, 126, 1181, 515.0, 1137.0, 1181.0, 1181.0, 0.08844037722148264, 12.330423213388011, 0.04847947281389352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 239.05263157894737, 127, 758, 132.0, 512.0, 758.0, 758.0, 0.10644078811000375, 1.674396316168356, 0.062198053043926435], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 677.1999999999999, 130, 1829, 514.0, 1698.8000000000002, 1829.0, 1829.0, 0.09164110897960681, 0.017952350059872193, 0.062311181131706604], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 357.6875, 256, 790, 266.0, 692.7, 790.0, 790.0, 0.07909749755292117, 0.122585672477037, 0.1778921258441186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=673cea70-cd25-40fa-a0bf-56c1044ab697", 1, 0, 0.0, 1612.0, 1612, 1612, 1612.0, 1612.0, 1612.0, 1612.0, 0.6203473945409429, 0.11207448045905706, 0.427700449751861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdf6b699-c6c2-4711-b118-cb7e99a0e8e9", 3, 0, 0.0, 377.6666666666667, 239, 584, 310.0, 584.0, 584.0, 584.0, 0.01825894840629812, 0.025171434407771007, 0.01170902615898675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 647.8695652173914, 166, 1310, 614.0, 1122.6000000000001, 1277.7999999999995, 1310.0, 0.09879470460383323, 0.06068541913653428, 0.044669871319897254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 130.78947368421052, 127, 136, 130.0, 135.0, 136.0, 136.0, 0.0884395538922713, 0.06572509815626804, 0.044392510449831495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed4d5f23-3815-4be4-9cbb-62dfdc6178c9", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 214.42105263157896, 127, 435, 132.0, 397.0, 435.0, 435.0, 0.088441612244043, 0.08658695672412269, 0.04692096636425842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2d13689-e54f-4cc6-89f7-4e56a136459d", 3, 0, 0.0, 459.6666666666667, 285, 570, 524.0, 570.0, 570.0, 570.0, 0.018226223890934277, 0.025126321021519092, 0.011688040711308764], "isController": false}, {"data": ["login", 23, 0, 0.0, 3025.391304347826, 1652, 5257, 2786.0, 4238.0, 5076.399999999998, 5257.0, 0.09776542249539864, 35.72933088202476, 0.19684672639921447], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 142.26315789473685, 129, 272, 134.0, 147.0, 272.0, 272.0, 0.10440707770084626, 0.08452487052148588, 0.03711345340147269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17a57d8d-530f-46c7-a363-b787dd369d8b", 3, 0, 0.0, 347.3333333333333, 224, 585, 233.0, 585.0, 585.0, 585.0, 0.04956220056170493, 0.03244452647447547, 0.031783051792499586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 870.6842105263157, 260, 1582, 647.0, 1556.0, 1582.0, 1582.0, 0.08838524803691712, 50.15921882850006, 0.188068507580198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37ed2de9-a0a8-49d8-b83f-17974dd2d132", 3, 0, 0.0, 294.3333333333333, 225, 428, 230.0, 428.0, 428.0, 428.0, 0.089304319352246, 0.040407878873574846, 0.05726872041794421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e2a49ca-9c9d-4072-8b68-85966d9a687c", 1, 0, 0.0, 1829.0, 1829, 1829, 1829.0, 1829.0, 1829.0, 1829.0, 0.5467468562055768, 0.09877750820120285, 0.3769563285948606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 943.7272727272727, 126, 1831, 1262.0, 1768.4000000000003, 1831.0, 1831.0, 0.048614916824296854, 37.01585688762883, 0.08147228203943996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 514.0666666666666, 262, 1811, 303.0, 1199.6000000000004, 1811.0, 1811.0, 0.09799502185288987, 7.957489249129478, 0.2187215712358479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddef1ffc-bb7b-42ab-a297-69bb2401373a", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1106.9166666666665, 252, 2004, 1176.0, 1802.5, 1986.5, 2004.0, 0.0974251348729211, 0.03044535464778784, 0.043955480772743694], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 136.27272727272728, 128, 147, 136.0, 146.4, 147.0, 147.0, 0.06225522377923166, 0.0483329129926652, 0.02212978657777375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 456.4736842105263, 259, 1436, 299.0, 780.0, 1436.0, 1436.0, 0.10636273049923306, 6.853365768134846, 0.23777996315091193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6bff4a2-d30c-4210-add3-f1724312e92c", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 450.8666666666667, 263, 1395, 290.0, 898.2000000000003, 1395.0, 1395.0, 0.084521803807989, 6.863423594402403, 0.18864980468419837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f055eeba-d8b6-4d6c-a299-34502c857af8", 3, 0, 0.0, 454.33333333333337, 236, 875, 252.0, 875.0, 875.0, 875.0, 0.040153654651800895, 0.025448947137713653, 0.025749576713557213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8afbd552-f62d-4256-81d2-3a85562ca46a", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.25127129694019473, 0.9589055980528512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 183.2, 130, 386, 133.5, 385.7, 386.0, 386.0, 0.05107721853898724, 0.03795875323063407, 0.025638369461952578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 180.89999999999998, 127, 379, 131.0, 379.0, 379.0, 379.0, 0.05107878391631252, 0.029011153052468125, 0.02827290500367767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 386.0, 129, 1426, 132.5, 1396.5, 1426.0, 1426.0, 0.05107774032076821, 9.202981742900194, 0.02915022601900092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 279.5, 128, 1004, 131.0, 978.6000000000001, 1004.0, 1004.0, 0.051079044821861826, 3.0148009513472096, 0.029200852381560463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 133.0, 130, 136, 133.0, 136.0, 136.0, 136.0, 0.05486366379546826, 0.016180494595929115, 0.03391474529544083], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1463.2592592592594, 1008, 2514, 1315.5, 2135.0, 2322.75, 2514.0, 0.24776438524608968, 296.41234159138145, 0.48923787789804035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1106.9166666666665, 252, 2004, 1176.0, 1802.5, 1986.5, 2004.0, 0.0927174320361907, 0.028974197511309596, 0.04183149765695323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39d7c1bf-9984-41f1-8535-82c00e62f9aa", 3, 0, 0.0, 730.0, 222, 1415, 553.0, 1415.0, 1415.0, 1415.0, 0.04280333295285926, 0.02751841880921128, 0.027448751926149987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 179.83333333333334, 127, 396, 140.0, 396.0, 396.0, 396.0, 0.034127363319909905, 0.009198390894819466, 0.020096484454986005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 175.0, 127, 403, 130.0, 403.0, 403.0, 403.0, 0.03412988697319097, 0.009199071098242879, 0.0200646405838486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 306.6363636363637, 127, 1548, 131.0, 1318.8000000000009, 1548.0, 1548.0, 0.06333231617795229, 5.196111800609717, 0.03673769122041373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 283.09090909090907, 130, 758, 144.0, 685.2000000000003, 758.0, 758.0, 0.06333523339033505, 1.708488162788823, 0.03680123424536069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 157.1818181818182, 127, 393, 133.0, 344.60000000000014, 393.0, 393.0, 0.06342872629351355, 0.04713794991148809, 0.03183824737779879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 135.16666666666669, 126, 152, 133.0, 152.0, 152.0, 152.0, 0.03412949869454667, 0.009132307267876748, 0.019464479724233652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 199.0, 128, 390, 129.0, 389.6, 390.0, 390.0, 0.06343201817615648, 0.025634103936245056, 0.03569177301140623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 178.0, 128, 399, 133.0, 399.0, 399.0, 399.0, 0.034129692832764506, 0.0253639611774744, 0.017131505972696245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 188.0, 135, 406, 147.5, 406.0, 406.0, 406.0, 0.0339287834834682, 0.02670566356218298, 0.012060622253889087], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 509.9333333333334, 126, 875, 508.0, 861.2, 875.0, 875.0, 0.08811193740527967, 0.01693974942433534, 0.05996315636050706], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1545.0869565217388, 878, 2406, 1447.0, 2186.2000000000003, 2371.3999999999996, 2406.0, 0.1006837741531619, 0.05211171904411701, 0.046310603150526625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 363.33333333333337, 259, 802, 280.0, 802.0, 802.0, 802.0, 0.03410156583023104, 0.052850766574781896, 0.07669522080763876], "isController": false}, {"data": ["addBook", 57, 18, 31.57894736842105, 1267.9824561403514, 671, 2495, 1049.0, 2224.8, 2361.2, 2495.0, 0.27055506507561305, 86.2517337996255, 0.9813137154211641], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/737f0339-ae7e-4fb3-a48d-e39dd4e20426", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.7732105024213075, 1.444745006053269], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 237.11111111111111, 127, 696, 135.0, 538.0, 551.75, 696.0, 0.24905336660194352, 0.18508751170320217, 0.12039200826949419], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 807.9074074074072, 629, 1309, 769.5, 1039.5, 1142.5, 1309.0, 0.2489741343538199, 73.20666221932777, 0.12521648358614967], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 236.1851851851852, 127, 573, 143.0, 408.5, 433.5, 573.0, 0.24954596498038292, 0.4415793833441932, 0.12136122125022529], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1222.9629629629628, 874, 2235, 1177.5, 1575.0, 1815.75, 2235.0, 0.24840263306791055, 223.51312587975931, 0.12468647792666601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 137.66666666666669, 129, 156, 135.0, 151.8, 156.0, 156.0, 0.08726866531303269, 0.06519582906686525, 0.031021283372992092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 18, 10.714285714285714, 202.66071428571428, 128, 1840, 139.0, 383.29999999999995, 429.14999999999975, 1019.5900000000026, 0.7506132241965535, 1.6402734991086467, 0.3590841653002229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 139.6, 129, 172, 135.5, 170.10000000000002, 172.0, 172.0, 0.05245048674051695, 0.04061839451682611, 0.018644508958543134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 139.26666666666668, 130, 162, 136.0, 153.6, 162.0, 162.0, 0.09369905114094211, 0.07603897607238565, 0.03330708458525677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17a57d8d-530f-46c7-a363-b787dd369d8b", 1, 0, 0.0, 1241.0, 1241, 1241, 1241.0, 1241.0, 1241.0, 1241.0, 0.8058017727639001, 0.14557942183722802, 0.5555625503626107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdf6b699-c6c2-4711-b118-cb7e99a0e8e9", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.2996087271973466, 1.1433716832504146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 572.0999999999999, 261, 1809, 269.5, 1779.9, 1809.0, 1809.0, 0.05104280449585022, 12.276273007544127, 0.11218450761558643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 536.1818181818181, 260, 1678, 509.0, 1499.2000000000007, 1678.0, 1678.0, 0.06328203653099382, 6.971642186825831, 0.14085084675679563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39d7c1bf-9984-41f1-8535-82c00e62f9aa", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70837c8b-f750-4576-b82e-26ef4b4c9409", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 139.0625, 130, 170, 135.0, 158.10000000000002, 170.0, 170.0, 0.0808856983974521, 0.06706245892523129, 0.0287523381022193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 177.89473684210526, 129, 401, 135.0, 385.0, 401.0, 401.0, 0.08793934961908377, 0.06827322553434727, 0.031259690684908685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b289ace4-2c0f-4bb6-8fa5-cb2bbae85a2c", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed4d5f23-3815-4be4-9cbb-62dfdc6178c9", 3, 0, 0.0, 1068.0, 259, 2467, 478.0, 2467.0, 2467.0, 2467.0, 0.046506580681166386, 0.029899250275163932, 0.029823555970669848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6bff4a2-d30c-4210-add3-f1724312e92c", 3, 0, 0.0, 358.3333333333333, 265, 501, 309.0, 501.0, 501.0, 501.0, 0.03138239447669857, 0.02616221102045086, 0.020124777708039124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddef1ffc-bb7b-42ab-a297-69bb2401373a", 3, 0, 0.0, 437.3333333333333, 264, 533, 515.0, 533.0, 533.0, 533.0, 0.042426213743264836, 0.027275967494449237, 0.02720691441218481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e2a49ca-9c9d-4072-8b68-85966d9a687c", 3, 0, 0.0, 596.6666666666666, 224, 852, 714.0, 852.0, 852.0, 852.0, 0.01975620838848608, 0.023351169485219064, 0.01266918311371015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 133.20000000000002, 127, 146, 132.0, 144.2, 146.0, 146.0, 0.08471130387638927, 0.06295439672844945, 0.04252110370357821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2d13689-e54f-4cc6-89f7-4e56a136459d", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 0.27880256558641975, 1.0639708719135803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 203.66666666666663, 127, 431, 134.0, 410.6, 431.0, 431.0, 0.08458280938981962, 0.031101803869381585, 0.04776505785464162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 238.8666666666667, 127, 1268, 130.0, 735.8000000000003, 1268.0, 1268.0, 0.08471034708652879, 5.102811227579995, 0.049315099195816434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 284.7333333333333, 127, 1129, 134.0, 706.0000000000002, 1129.0, 1129.0, 0.08458853317844232, 1.6794017934178842, 0.04932678982287161], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 23.529411764705884, 0.622568093385214], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.882352941176471, 0.1556420233463035], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.882352941176471, 0.1556420233463035], "isController": false}, {"data": ["401/Unauthorized", 22, 64.70588235294117, 1.7120622568093384], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 34, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
