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

    var data = {"OkPercent": 98.32535885167464, "KoPercent": 1.674641148325359};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8045112781954887, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3888888888888889, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e98294a-bfe0-4501-b15e-ff7f21bf0516"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/647343f1-a6e4-4691-a6c1-3f083a5b0ced"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e7dd71d-05bc-482f-a212-8d0e9c496109"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/49c46976-b118-45d5-a4e4-4d32e191285a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32e3be96-39b5-4115-8011-b86bf7bbbdb3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90fbe2f6-4583-4adc-a650-c7a9b320c6a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2da42fb9-4ec3-4004-a62e-75adf02f4982"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e0baac9b-ed62-47de-aacd-4b26668d1d12"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49c46976-b118-45d5-a4e4-4d32e191285a"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e7dd71d-05bc-482f-a212-8d0e9c496109"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3dd50f3-61a4-4706-ab3a-519240bc0707"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e81b9b5-49ca-4491-b78d-26019ec81a46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01f26322-23eb-4dbd-b74f-7acd3e164d1a"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4ddee6e5-6a1e-45d4-9e1d-6e1101d3be3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e98294a-bfe0-4501-b15e-ff7f21bf0516"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90fbe2f6-4583-4adc-a650-c7a9b320c6a1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0baac9b-ed62-47de-aacd-4b26668d1d12"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2972d408-d595-4357-bbd9-dc72e59681df"], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2da42fb9-4ec3-4004-a62e-75adf02f4982"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/399530ed-cffc-414d-9880-ef514da6dba4"], "isController": false}, {"data": [0.8425925925925926, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9420731707317073, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0635f0bb-6666-45fb-a2ce-e447e078ae47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01f26322-23eb-4dbd-b74f-7acd3e164d1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32e3be96-39b5-4115-8011-b86bf7bbbdb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2972d408-d595-4357-bbd9-dc72e59681df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ddee6e5-6a1e-45d4-9e1d-6e1101d3be3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e81b9b5-49ca-4491-b78d-26019ec81a46"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3dd50f3-61a4-4706-ab3a-519240bc0707"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1254, 21, 1.674641148325359, 327.8867623604466, 76, 3991, 107.0, 871.0, 1099.0, 1829.2000000000053, 4.966375971294822, 713.9002439190112, 3.628869244756394], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1352.4814814814813, 1013, 1818, 1309.0, 1623.0, 1752.0, 1818.0, 0.24857987239566548, 299.12611425783945, 1.2222652905392342], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e98294a-bfe0-4501-b15e-ff7f21bf0516", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/647343f1-a6e4-4691-a6c1-3f083a5b0ced", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 603.8571428571428, 80, 1164, 577.0, 1049.0, 1164.0, 1164.0, 0.0785065805337326, 0.015464744937727459, 0.052823275378654055], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 603.8571428571428, 80, 1164, 577.0, 1049.0, 1164.0, 1164.0, 0.07775747443723027, 0.015317181069387438, 0.0523192381711442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 142.5, 77, 249, 81.5, 243.60000000000002, 249.0, 249.0, 0.08741258741258741, 0.03797743055555556, 0.049036792200854704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 102.88888888888889, 80, 242, 82.5, 241.1, 242.0, 242.0, 0.08746483184886077, 0.06500071976267875, 0.04390324567413519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 204.16666666666666, 80, 675, 157.5, 617.4000000000001, 675.0, 675.0, 0.08747970956736424, 2.878951926254605, 0.050678620809478915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 210.94444444444443, 78, 844, 85.0, 721.6000000000001, 844.0, 844.0, 0.08748141020033243, 8.767173162768884, 0.05059417495310024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e7dd71d-05bc-482f-a212-8d0e9c496109", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 209.57142857142858, 81, 376, 211.5, 330.5, 376.0, 376.0, 0.07929091269504149, 0.15592699572395435, 0.051249274346557926], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 90.63157894736842, 79, 242, 81.0, 99.0, 242.0, 242.0, 0.11991694173930056, 0.08911796158555442, 0.06019268364648485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 97.57894736842105, 79, 241, 81.0, 236.0, 241.0, 241.0, 0.11991921232012118, 0.032087757984094925, 0.06839142577631911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 550.1666666666666, 389, 638, 585.5, 638.0, 638.0, 638.0, 0.03485859031860752, 10.249582967802283, 0.01988028979108085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 883.1666666666667, 709, 1097, 861.0, 1097.0, 1097.0, 1097.0, 0.03477837480654529, 31.29364278479142, 0.019800578625210844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 133.16666666666666, 79, 241, 82.0, 241.0, 241.0, 241.0, 0.0349383629047755, 0.06182452498384101, 0.01934575367871846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49c46976-b118-45d5-a4e4-4d32e191285a", 3, 0, 0.0, 951.0, 376, 2057, 420.0, 2057.0, 2057.0, 2057.0, 0.017602534765006162, 0.02426651521152379, 0.011288083817403038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 99.85714285714288, 78, 330, 82.0, 208.0, 330.0, 330.0, 0.08843743683040226, 0.06572352483196887, 0.04439144778401051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 115.14285714285715, 78, 250, 81.0, 244.5, 250.0, 250.0, 0.0884911003236246, 0.023678282703782364, 0.050467580653317155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 114.21428571428571, 76, 240, 81.5, 239.5, 240.0, 240.0, 0.08857788210283893, 0.023874507285530804, 0.052074106470614286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 115.07142857142857, 77, 250, 82.0, 243.0, 250.0, 250.0, 0.0884905409932431, 0.02385096612708506, 0.05210917599504453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32e3be96-39b5-4115-8011-b86bf7bbbdb3", 3, 0, 0.0, 285.3333333333333, 216, 398, 242.0, 398.0, 398.0, 398.0, 0.060741040696497266, 0.026890564891678476, 0.038951774144563675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90fbe2f6-4583-4adc-a650-c7a9b320c6a1", 3, 0, 0.0, 385.0, 285, 504, 366.0, 504.0, 504.0, 504.0, 0.03850349740101393, 0.032098781524738496, 0.024691370403644997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 106.66666666666666, 79, 238, 81.0, 238.0, 238.0, 238.0, 0.0349385663541606, 0.02596508690968381, 0.019618823880510103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2da42fb9-4ec3-4004-a62e-75adf02f4982", 3, 0, 0.0, 864.0, 231, 1893, 468.0, 1893.0, 1893.0, 1893.0, 0.05298949041773382, 0.03406713658041155, 0.0339808906650181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 475.68421052631584, 78, 967, 88.0, 962.0, 967.0, 967.0, 0.09522663940177623, 40.60118648790371, 0.052106435190753995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 97.21052631578947, 78, 238, 81.0, 234.0, 238.0, 238.0, 0.1199184554502938, 0.032321771195587, 0.07049893572370788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 351.1052631578948, 79, 794, 86.0, 777.0, 794.0, 794.0, 0.09522711667326574, 13.276635478741799, 0.052199691576910935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 127.4736842105263, 79, 318, 81.0, 243.0, 318.0, 318.0, 0.11991996919950265, 0.03232217919830345, 0.07061693498759776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0baac9b-ed62-47de-aacd-4b26668d1d12", 3, 0, 0.0, 1401.3333333333333, 220, 3502, 482.0, 3502.0, 3502.0, 3502.0, 0.02403114436309457, 0.024101548106345825, 0.015410597133885517], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 443.21428571428567, 81, 767, 509.0, 707.0, 767.0, 767.0, 0.07774711086182673, 0.015315139583830822, 0.05281120016549028], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 238.78571428571428, 162, 581, 166.0, 453.5, 581.0, 581.0, 0.08830579033682351, 0.1368567277974013, 0.19860179213447712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49c46976-b118-45d5-a4e4-4d32e191285a", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 633.5238095238095, 102, 1624, 450.0, 1347.6000000000001, 1599.5999999999997, 1624.0, 0.08907741251325557, 0.05471649655355249, 0.04027621288441145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 82.68421052631578, 78, 89, 82.0, 88.0, 89.0, 89.0, 0.09522568487314936, 0.07076830682467447, 0.04779883010234255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 116.05263157894737, 77, 250, 83.0, 242.0, 250.0, 250.0, 0.09522616213507079, 0.09322923192582383, 0.050520376519233176], "isController": false}, {"data": ["login", 21, 0, 0.0, 3341.9523809523807, 1809, 6358, 3322.0, 4550.200000000001, 6189.499999999997, 6358.0, 0.08727671706550741, 29.95106074979012, 0.17303144897013473], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 88.36842105263156, 83, 99, 87.0, 98.0, 99.0, 99.0, 0.11697706633830998, 0.09470116015083885, 0.04158169154994613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e7dd71d-05bc-482f-a212-8d0e9c496109", 3, 0, 0.0, 308.6666666666667, 214, 491, 221.0, 491.0, 491.0, 491.0, 0.04321770197072721, 0.02778481816151896, 0.027714476849717645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3dd50f3-61a4-4706-ab3a-519240bc0707", 3, 0, 0.0, 312.6666666666667, 174, 506, 258.0, 506.0, 506.0, 506.0, 0.01932080915548743, 0.022949750198038295, 0.012389972017028074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 560.6315789473683, 163, 1054, 182.0, 1046.0, 1054.0, 1054.0, 0.09518656566871067, 54.01901202920224, 0.20254053413440343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e81b9b5-49ca-4491-b78d-26019ec81a46", 3, 0, 0.0, 301.6666666666667, 200, 498, 207.0, 498.0, 498.0, 498.0, 0.02639776146982736, 0.026475098661633494, 0.016928251984231736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01f26322-23eb-4dbd-b74f-7acd3e164d1a", 3, 0, 0.0, 293.6666666666667, 185, 498, 198.0, 498.0, 498.0, 498.0, 0.017332224070992792, 0.023893870097869294, 0.011114740045525975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 359.44444444444446, 164, 925, 323.0, 803.5000000000002, 925.0, 925.0, 0.08736294937317084, 11.733291532588806, 0.19399769519552312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 626.7, 79, 1177, 891.5, 1167.6000000000001, 1177.0, 1177.0, 0.05793709190560889, 41.59394354609765, 0.09374040416915314], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1280.2608695652173, 227, 3991, 1084.0, 2513.4000000000024, 3829.399999999998, 3991.0, 0.09358838201963729, 0.029484790870656787, 0.04222444579401604], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 236.26315789473682, 161, 485, 171.0, 400.0, 485.0, 485.0, 0.11985491247437313, 0.1857517051726857, 0.2695565072543763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 102.5625, 80, 236, 91.0, 164.60000000000008, 236.0, 236.0, 0.10138003573646259, 0.07870813321336696, 0.036037434578195686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 394.7857142857143, 164, 1187, 318.0, 1020.0, 1187.0, 1187.0, 0.06463855505127222, 16.649464286332638, 0.14182968664151918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 82.16666666666667, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.03031099076525148, 0.022526039035504274, 0.015214696536464121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 80.0, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.030311143892051914, 0.008110599049240453, 0.017286824250935855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ddee6e5-6a1e-45d4-9e1d-6e1101d3be3b", 3, 0, 0.0, 752.6666666666667, 199, 1748, 311.0, 1748.0, 1748.0, 1748.0, 0.04921502042423347, 0.03164051606050167, 0.0315604134881966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 81.33333333333334, 80, 82, 81.5, 82.0, 82.0, 82.0, 0.03031099076525148, 0.008169759229696687, 0.01781954730535292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 81.0, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.030311297020399502, 0.008169841775029553, 0.017849328225879785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 83.5, 81, 86, 83.5, 86.0, 86.0, 86.0, 0.056986551173922956, 0.016806580521996812, 0.03522703798153636], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 918.9444444444443, 638, 1425, 854.0, 1281.0, 1405.75, 1425.0, 0.2402135231316726, 287.3788853981317, 0.47432787477758004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1280.2608695652173, 227, 3991, 1084.0, 2513.4000000000024, 3829.399999999998, 3991.0, 0.09108983041449834, 0.028697628298045928, 0.04109716958154124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 134.0, 79, 241, 82.0, 241.0, 241.0, 241.0, 0.0209819555182543, 0.00565529269827948, 0.012355585134284516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 131.33333333333334, 78, 236, 80.0, 236.0, 236.0, 236.0, 0.02095894143373132, 0.005649089683310395, 0.012321565178814702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 184.99999999999997, 78, 961, 83.0, 459.8000000000005, 961.0, 961.0, 0.09432849899775969, 5.328644773980073, 0.054948193019691075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 172.9375, 77, 612, 84.5, 351.60000000000025, 612.0, 612.0, 0.09432794288443058, 1.7573070072396695, 0.05503998620453835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 185.0, 80, 241, 234.0, 241.0, 241.0, 241.0, 0.020959234289307297, 0.005608232612568554, 0.011953313305620569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 120.24999999999999, 77, 243, 82.0, 242.3, 243.0, 243.0, 0.09423849406886478, 0.0700346620960997, 0.047303306593160635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 133.0, 79, 238, 82.0, 238.0, 238.0, 238.0, 0.0209819555182543, 0.01559303530214016, 0.010531958140998741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 80.87499999999999, 77, 90, 80.5, 85.10000000000001, 90.0, 90.0, 0.09432961124408966, 0.0340954564079284, 0.0533022180723744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e98294a-bfe0-4501-b15e-ff7f21bf0516", 3, 0, 0.0, 309.3333333333333, 182, 543, 203.0, 543.0, 543.0, 543.0, 0.08465489023082567, 0.039296182769908004, 0.05428715291495005], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 515.0, 79, 1748, 492.0, 1145.5, 1748.0, 1748.0, 0.0779705382751803, 0.015054579376792625, 0.05306086575144106], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 85.66666666666667, 82, 91, 84.0, 91.0, 91.0, 91.0, 0.019551488845875615, 0.015389160165796625, 0.006949943300682347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1833.4285714285713, 1146, 3373, 1653.0, 3265.4, 3369.2, 3373.0, 0.08775595486836607, 0.04542056257835353, 0.040364311272461345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 320.3333333333333, 162, 475, 324.0, 475.0, 475.0, 475.0, 0.020947233917761158, 0.03246412131590523, 0.04711082003183979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90fbe2f6-4583-4adc-a650-c7a9b320c6a1", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0baac9b-ed62-47de-aacd-4b26668d1d12", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2972d408-d595-4357-bbd9-dc72e59681df", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.27923348145285937, 1.0656153400309119], "isController": false}, {"data": ["addBook", 55, 7, 12.727272727272727, 944.6545454545453, 419, 1917, 760.0, 1584.4, 1752.5999999999995, 1917.0, 0.25909786833117415, 85.53350606524555, 0.9411573651513366], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2da42fb9-4ec3-4004-a62e-75adf02f4982", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 146.44444444444446, 79, 338, 85.0, 323.0, 331.0, 338.0, 0.2409552537169579, 0.17906928523301266, 0.11647739315419352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/399530ed-cffc-414d-9880-ef514da6dba4", 1, 0, 0.0, 2160.0, 2160, 2160, 2160.0, 2160.0, 2160.0, 2160.0, 0.46296296296296297, 0.14784071180555555, 0.27624059606481477], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 503.7407407407409, 383, 803, 472.0, 640.0, 716.0, 803.0, 0.24093482712926154, 70.84283896518491, 0.12117327731598602], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 119.24074074074073, 79, 247, 84.5, 241.0, 244.0, 247.0, 0.24127500435635424, 0.426943660052455, 0.11733882047799259], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 770.888888888889, 551, 1106, 767.5, 993.5, 1050.0, 1106.0, 0.24062026557347832, 216.51053792832636, 0.12078009424293736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 86.64285714285715, 82, 98, 85.0, 95.0, 98.0, 98.0, 0.06561003271128775, 0.04901530764075695, 0.023322316315340562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 7, 4.2682926829268295, 166.51219512195115, 79, 1580, 91.0, 294.0, 416.25, 1325.1999999999978, 0.7111882046834346, 1.548486793961405, 0.3409414299653079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 116.0, 81, 281, 83.5, 281.0, 281.0, 281.0, 0.02852863561800157, 0.022092976606518794, 0.010141038442336495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0635f0bb-6666-45fb-a2ce-e447e078ae47", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.8003406954887218, 1.495437813283208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 95.83333333333333, 83, 239, 85.0, 115.70000000000019, 239.0, 239.0, 0.08757973404954095, 0.07107300683121925, 0.031131858587922757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01f26322-23eb-4dbd-b74f-7acd3e164d1a", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32e3be96-39b5-4115-8011-b86bf7bbbdb3", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2972d408-d595-4357-bbd9-dc72e59681df", 3, 0, 0.0, 334.0, 223, 493, 286.0, 493.0, 493.0, 493.0, 0.015571473061351603, 0.021466532687117203, 0.009985612607702688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 164.66666666666669, 164, 166, 164.5, 166.0, 166.0, 166.0, 0.030298286631890964, 0.04695642664532321, 0.06814155675121572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 316.8125, 159, 1040, 169.5, 648.7000000000004, 1040.0, 1040.0, 0.09419244694316074, 7.179788223368557, 0.21033476952285637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ddee6e5-6a1e-45d4-9e1d-6e1101d3be3b", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 0.23554636571056062, 0.8988958604954368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 108.21428571428571, 82, 244, 85.0, 243.5, 244.0, 244.0, 0.09218046300929705, 0.07642696591298163, 0.03276727396033606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 96.52631578947368, 80, 242, 85.0, 109.0, 242.0, 242.0, 0.09351083987499077, 0.07259874775450943, 0.03324018136181313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e81b9b5-49ca-4491-b78d-26019ec81a46", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3dd50f3-61a4-4706-ab3a-519240bc0707", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 84.14285714285714, 80, 94, 82.5, 92.0, 94.0, 94.0, 0.06487007450791415, 0.04820910810597916, 0.03256173661823034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 155.42857142857142, 78, 324, 85.5, 285.5, 324.0, 324.0, 0.06482171712728671, 0.038207555086884254, 0.035802061677863845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 286.71428571428567, 77, 1107, 84.0, 939.5, 1107.0, 1107.0, 0.06466303629905731, 12.481675498655932, 0.03682401146383258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 220.35714285714286, 80, 639, 87.0, 627.0, 639.0, 639.0, 0.06470278314400066, 4.090438098500744, 0.03690983262776489], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.4784688995215311], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.1594896331738437], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.1594896331738437], "isController": false}, {"data": ["401/Unauthorized", 11, 52.38095238095238, 0.8771929824561403], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1254, 21, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
